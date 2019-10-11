const { NoteModel, UserModel } = require('./../models');

const axios = require('axios');
const CodeNoteService = require('./../services/codeNote');
const CodeYearService = require('./../services/codeYear');
const SubjectService = require('./../services/subject');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const boom = require('@hapi/boom');

const {
  createFolder,
  MIME_TYPE_FOLDER,
  getFolderApuntus,
  authorize,
  createFile
} = require('./../utils/gapi');

const createOne = async ({ data }) => {
  await CodeNoteService.getOne({ filter: { _id: data.codeNote } });
  await CodeYearService.getOne({ filter: { _id: data.codeYear } });
  await SubjectService.getOne({ filter: { _id: data.subject } });

  const noteCreated = new NoteModel({
    ...data,
    googleFolderId: 'xxx-xxx'
  });

  const auth = authorize();
  const folderApuntus = await getFolderApuntus({ auth });

  const folder = await createFolder({
    config: {
      resource: {
        name: `${new Date().toJSON()}-${noteCreated.owner}-${noteCreated._id}`,
        mimeType: MIME_TYPE_FOLDER,
        parents: [folderApuntus.id]
      }
    }
  });

  noteCreated.googleFolderId = folder.data.id;

  await noteCreated.save();

  await UserModel.findOneAndUpdate(
    {
      _id: data.owner,
      'created.note': { $ne: noteCreated._id }
    },
    {
      $push: { created: { note: noteCreated } }
    }
  );

  return noteCreated;
};

const deleteOne = ({ filter }) => {
  const { _id, user } = filter;

  return NoteModel.findOneAndUpdate(
    { _id, isActive: true, owner: user._id },
    { isActive: false }
  ).orFail(boom.badRequest('¡Fallo al eliminar el apunte!'));
};

const updateOne = async ({ filter, data }) => {
  if (data.codeNote)
    await CodeNoteService.getOne({ filter: { _id: data.codeNote } });
  if (data.codeYear)
    await CodeYearService.getOne({ filter: { _id: data.codeYear } });
  if (data.subject)
    await SubjectService.getOne({ filter: { _id: data.subject } });

  const { _id, user } = filter;

  return NoteModel.findOneAndUpdate(
    { _id, isActive: true, owner: user._id },
    data,
    { new: true }
  ).orFail(boom.badRequest('¡Fallo al actualizar el apunte!'));
};

const getOne = async ({ filter }) => {
  const { _id, user = {} } = filter;

  return new Promise(async (resolve, reject) => {
    const note = await NoteModel.aggregate()
      .match({ _id: ObjectId(_id), isActive: true })
      .addFields({
        countFavorites: { $size: '$favorites' },
        countSaved: { $size: '$saved' },
        isFavorite: { $in: [user._id, '$favorites.user'] },
        isSaved: { $in: [user._id, '$saved.user'] }
      })
      .project({
        saved: 0,
        favorites: 0
      });

    const notePopulate = await NoteModel.populate(note, [
      'codeNote',
      'codeYear',
      {
        path: 'owner',
        select: ['email', 'username', '_id']
      },
      {
        path: 'subject',
        select: ['name', '_id', 'institution'],
        populate: [
          {
            path: 'institution',
            select: ['name', '_id']
          }
        ]
      }
    ]);

    if (notePopulate && notePopulate[0]) {
      resolve(notePopulate[0]);
    } else {
      reject(boom.notFound('¡No se encontro el apunte!'));
    }
  });
};

const getOnelight = ({ filter }) => {
  return NoteModel.findOne(filter).orFail(
    boom.notFound('¡No existe el apunte!')
  );
};

const getAll = async ({ user = {}, page = 0, limit = 20, filter }) => {
  const customFilter = {};
  if (filter.codeNote) customFilter['codeNote'] = ObjectId(filter.codeNote);
  if (filter.codeYear) customFilter['codeYear'] = ObjectId(filter.codeYear);
  if (filter.subject) customFilter['subject._id'] = ObjectId(filter.subject);
  if (filter.institution)
    customFilter['subject.institution._id'] = ObjectId(filter.institution);

  if (filter.search)
    customFilter['$or'] = [
      { title: { $regex: new RegExp(filter.search.toLowerCase(), 'i') } },
      {
        description: {
          $regex: new RegExp(filter.search.toLowerCase(), 'i')
        }
      }
    ];

  const notesFiltered = await NoteModel.aggregate()
    .lookup({
      from: 'subjects',
      localField: 'subject',
      foreignField: '_id',
      as: 'subject'
    })
    .addFields({
      subject: { $arrayElemAt: ['$subject', 0] }
    })
    .lookup({
      from: 'institutions',
      localField: 'subject.institution',
      foreignField: '_id',
      as: 'subject.institution'
    })
    .addFields({
      'subject.institution': { $arrayElemAt: ['$subject.institution', 0] }
    })
    .match({
      isActive: true,
      ...customFilter
    })
    .addFields({
      countFavorites: { $size: '$favorites' }
    })
    .sort({
      countFavorites: -1,
      createdAt: -1
    })
    .addFields({
      isFavorite: { $in: [user._id, '$favorites.user'] },
      isSaved: { $in: [user._id, '$saved.user'] }
    })
    .project({
      saved: 0,
      favorites: 0,
      'subject.institution.subjects': 0
    });

  const skip = page == 0 ? 0 : page * limit;
  const notesPaginated = notesFiltered.slice(skip, skip + limit);
  const notesPopulates = await NoteModel.populate(notesPaginated, [
    {
      path: 'owner',
      select: ['email', 'username', '_id']
    },
    {
      path: 'codeYear'
    },
    {
      path: 'codeNote'
    }
  ]);

  const data = {};

  if (notesPopulates.length == limit) data.nextPage = page + 1;
  data.array = notesPopulates;

  return data;
};

const addFavorite = ({ filter }) => {
  const { _id, user = {} } = filter;

  return new Promise(async (resolve, reject) => {
    let note = {};
    try {
      note = await getOnelight({ filter: { _id, isActive: true } });
    } catch (error) {
      reject(error);
    }

    const noteFavorite = await NoteModel.findOneAndUpdate(
      { _id, 'favorites.user': { $ne: user._id } },
      {
        $push: { favorites: { user: user } }
      }
    );
    const userFavorite = await UserModel.findOneAndUpdate(
      { _id: user._id, 'favorites.note': { $ne: note._id } },
      {
        $push: { favorites: { note: note } }
      }
    );

    if (!noteFavorite || !userFavorite) {
      reject(boom.badRequest('¡Ya esta agregado en tus favoritos!'));
    } else {
      resolve(true);
    }
  });
};

const removeFavorite = ({ filter }) => {
  const { _id, user = {} } = filter;

  return new Promise(async (resolve, reject) => {
    let note = {};
    try {
      note = await getOnelight({ filter: { _id, isActive: true } });
    } catch (error) {
      reject(error);
    }

    const noteFavorite = await NoteModel.findOneAndUpdate(
      {
        _id: note._id,
        'favorites.user': { $eq: user._id }
      },
      {
        $pull: { favorites: { user: user._id } }
      }
    );

    const userFavorite = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        'favorites.note': { $eq: note._id }
      },
      {
        $pull: { favorites: { note: note._id } }
      }
    );

    if (!noteFavorite || !userFavorite) {
      reject(boom.badRequest('¡Ya esta removido de tus favoritos!'));
    } else {
      resolve(true);
    }
  });
};

const addSaved = ({ filter }) => {
  const { _id, user = {} } = filter;

  return new Promise(async (resolve, reject) => {
    let note = {};
    try {
      note = await getOnelight({ filter: { _id, isActive: true } });
    } catch (error) {
      reject(error);
    }

    const noteSaved = await NoteModel.findOneAndUpdate(
      { _id, 'saved.user': { $ne: user._id } },
      {
        $push: { saved: { user: user } }
      }
    );
    const userSaved = await UserModel.findOneAndUpdate(
      { _id: user._id, 'saved.note': { $ne: note._id } },
      {
        $push: { saved: { note: note } }
      }
    );

    if (!noteSaved || !userSaved) {
      reject(boom.badRequest('¡Ya esta agregado en tus guardados!'));
    } else {
      resolve(true);
    }
  });
};

const removeSaved = ({ filter }) => {
  const { _id, user = {} } = filter;

  return new Promise(async (resolve, reject) => {
    let note = {};
    try {
      note = await getOnelight({ filter: { _id, isActive: true } });
    } catch (error) {
      reject(error);
    }

    const noteSaved = await NoteModel.findOneAndUpdate(
      {
        _id: note._id,
        'saved.user': { $eq: user._id }
      },
      {
        $pull: { saved: { user: user._id } }
      }
    );

    const userSaved = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        'saved.note': { $eq: note._id }
      },
      {
        $pull: { saved: { note: note._id } }
      }
    );

    if (!noteSaved || !userSaved) {
      reject(boom.badRequest('¡Ya esta removido de tus guardados!'));
    } else {
      resolve(true);
    }
  });
};

const addFile = ({ _id }, { file }) => {
  // return createFile({
  //   config: {
  //     resource: {
  //       name: 'photo.jpg',
  //       parents: [folder.data.id]
  //     },
  //     media: {
  //       mimeType: 'image/jpeg',
  //       body: file
  //     }
  //   }
  // });
};

module.exports = {
  createOne,
  getOne,
  getOnelight,
  getAll,
  addFavorite,
  removeFavorite,
  addSaved,
  removeSaved,
  deleteOne,
  updateOne,
  addFile
};

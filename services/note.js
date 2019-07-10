const { NoteModel, UserModel } = require('./../models');

const CodeNoteService = require('./../services/codeNote');
const CodeYearService = require('./../services/codeYear');
const SubjectService = require('./../services/subject');

const mongoose = require('mongoose');
const boom = require('@hapi/boom');

const createOne = async ({ data }) => {
  await CodeNoteService.getOne({ _id: data.codeNote });
  await CodeYearService.getOne({ _id: data.codeYear });
  await SubjectService.getOne({ _id: data.subject });

  const noteCreated = await NoteModel.create(data);

  await UserModel.findOneAndUpdate(
    {
      _id: data.owner,
      notesCreated: { $ne: noteCreated._id }
    },
    {
      $push: { notesCreated: noteCreated }
    }
  );

  return noteCreated;
};

const getOne = async ({ _id, user = {} }) => {
  return new Promise(async (resolve, reject) => {
    const note = await NoteModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(_id) } }
    ])
      .addFields({
        countFavorites: { $size: '$favorites' },
        countSaved: { $size: '$saved' },
        isFavorite: { $in: [user._id, '$favorites'] },
        isSaved: { $in: [user._id, '$saved'] }
      })
      .project({
        title: 1,
        description: 1,
        googleFolderId: 1,
        codeNote: 1,
        codeYear: 1,
        subject: 1,
        owner: 1,
        countFavorites: 1,
        countSaved: 1,
        isFavorite: 1,
        isSaved: 1
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

const getOnelight = ({ _id }) => {
  return NoteModel.findById(_id).orFail(boom.notFound('¡No existe el apunte!'));
};

const getAll = async ({ user = {}, page = 0, limit = 5 }) => {
  const notes = await NoteModel.aggregate([{ $match: {} }])
    .skip(page == 0 ? 0 : page * limit)
    .limit(limit)
    .addFields({
      countFavorites: { $size: '$favorites' },
      countSaved: { $size: '$saved' },
      isFavorite: { $in: [user._id, '$favorites'] },
      isSaved: { $in: [user._id, '$saved'] }
    })
    .project({
      title: 1,
      description: 1,
      googleFolderId: 1,
      codeNote: 1,
      codeYear: 1,
      subject: 1,
      owner: 1,
      countFavorites: 1,
      countSaved: 1,
      isFavorite: 1,
      isSaved: 1
    });

  const notesPopulates = await NoteModel.populate(notes, [
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

  return notesPopulates;
};

const addFavorite = ({ _id, user = {} }) => {
  return new Promise(async (resolve, reject) => {
    const note = await getOnelight({ _id });

    const noteFavorite = await NoteModel.findOneAndUpdate(
      { _id, favorites: { $ne: user._id } },
      {
        $push: { favorites: user }
      }
    );
    const userFavorite = await UserModel.findOneAndUpdate(
      { _id: user._id, notesFavorites: { $ne: note._id } },
      {
        $push: { notesFavorites: note }
      }
    );

    if (!noteFavorite || !userFavorite) {
      reject(boom.badRequest('¡Ya esta agregado en tus favoritos!'));
    } else {
      resolve(true);
    }
  });
};

const removeFavorite = ({ _id, user = {} }) => {
  return new Promise(async (resolve, reject) => {
    const note = await getOnelight({ _id });

    const noteFavorite = await NoteModel.findOneAndUpdate(
      {
        _id: note._id,
        favorites: { $eq: user._id }
      },
      {
        $pull: { favorites: user._id }
      }
    );

    const userFavorite = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        notesFavorites: { $eq: note._id }
      },
      {
        $pull: { notesFavorites: note._id }
      }
    );

    if (!noteFavorite || !userFavorite) {
      reject(boom.badRequest('¡Ya esta removido de tus favoritos!'));
    } else {
      resolve(true);
    }
  });
};

const addSaved = ({ _id, user = {} }) => {
  return new Promise(async (resolve, reject) => {
    const note = await getOnelight({ _id });

    const noteSaved = await NoteModel.findOneAndUpdate(
      { _id, saved: { $ne: user._id } },
      {
        $push: { saved: user }
      }
    );
    const userSaved = await UserModel.findOneAndUpdate(
      { _id: user._id, notesSaved: { $ne: note._id } },
      {
        $push: { notesSaved: note }
      }
    );

    if (!noteSaved || !userSaved) {
      reject(boom.badRequest('¡Ya esta agregado en tus guardados!'));
    } else {
      resolve(true);
    }
  });
};

const removeSaved = ({ _id, user = {} }) => {
  return new Promise(async (resolve, reject) => {
    const note = await getOnelight({ _id });

    const noteSaved = await NoteModel.findOneAndUpdate(
      {
        _id: note._id,
        saved: { $eq: user._id }
      },
      {
        $pull: { saved: user._id }
      }
    );

    const userSaved = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        notesSaved: { $eq: note._id }
      },
      {
        $pull: { notesSaved: note._id }
      }
    );

    if (!noteSaved || !userSaved) {
      reject(boom.badRequest('¡Ya esta removido de tus guardados!'));
    } else {
      resolve(true);
    }
  });
};

module.exports = {
  createOne,
  getOne,
  getOnelight,
  getAll,
  addFavorite,
  removeFavorite,
  addSaved,
  removeSaved
};

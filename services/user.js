const { UserModel, NoteModel } = require('./../models');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');

const getOne = ({
  filter,
  select = '',
  failText = '¡No se encontro el usuario!',
  withFail = true
}) => {
  let cursor = UserModel.findOne(filter).select(select);
  if (withFail) cursor = cursor.orFail(boom.notFound(failText));

  return cursor;
};

const createOne = async ({ data }) => {
  const { username, email, password } = data;

  return UserModel.create({
    username,
    email,
    password: await bcrypt.hash(password, 10)
  });
};

const updateOne = async ({ filter, data }) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);

  return UserModel.findOneAndUpdate(filter, data, {
    new: true
  });
};

const getNoteList = async ({ filter, paginate }) => {
  const limit = 12;
  const notesOfTheUser = await UserModel.findOne({
    isActive: true,
    _id: filter._id
  })
    .select(filter.noteName)
    .orFail(boom.notFound('¡No existe el usuario!'));

  const notesSorted = notesOfTheUser[filter.noteName]
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const skip = paginate.page == 0 ? 0 : paginate.page * limit;
  const notesPaginated = notesSorted.slice(skip, skip + limit);

  const notesPopulates = await NoteModel.populate(notesPaginated, [
    {
      path: 'note',
      select: '-favorites -saved',
      populate: [
        {
          path: 'codeYear'
        },
        {
          path: 'codeNote'
        },
        {
          path: 'subject',
          populate: {
            path: 'institution',
            select: '-subjects -nameSort -createdAt -updatedAt'
          }
        },
        {
          path: 'owner',
          select: ['email', 'username', '_id']
        }
      ]
    }
  ]);

  const data = {};

  data.total = notesSorted.length;
  if (notesPopulates.length == limit) data.nextPage = paginate.page + 1;

  data.array = [...notesPopulates]
    .filter(({ note }) => (note ? true : false))
    .map(({ note, createdAt, updatedAt }) => ({
      ...note._doc,
      createdAt,
      updatedAt
    }));

  return data;
};

module.exports = {
  getOne,
  createOne,
  getNoteList,
  updateOne
};

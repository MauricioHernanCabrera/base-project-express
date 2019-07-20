const { UserModel, NoteModel } = require('./../models');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const getOne = ({ filter, select = '' }) => {
  return UserModel.findOne(filter).select(select);
};

const createOne = async ({ data }) => {
  const { username, email, password } = data;
  return UserModel.create({
    username,
    email,
    password: await bcrypt.hash(password, 10)
  });
};

const getAllNotes = async ({ _id, page = 0, limit = 20, noteName }) => {
  const notesPopulates = await UserModel.findOne({
    isActive: true,
    _id
  }).select(noteName);

  const notesSorted = notesPopulates[noteName]
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const skip = page == 0 ? 0 : page * limit;
  const notesPaginated = notesSorted.slice(skip, skip + limit);

  return NoteModel.populate(notesPaginated, [
    {
      path: 'note',
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
            select: '-subjects'
          }
        },
        {
          path: 'owner',
          select: ['email', 'username', '_id']
        }
      ]
    }
  ]);
};

module.exports = {
  getOne,
  createOne,
  getAllNotes
};

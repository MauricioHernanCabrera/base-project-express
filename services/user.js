const { UserModel } = require('./../models');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const getOne = ({ filter }) => {
  return UserModel.findOne(filter);
};

const createOne = async ({ data }) => {
  const { username, email, password } = data;
  return UserModel.create({
    username,
    email,
    password: await bcrypt.hash(password, 10)
  });
};

const getAllNotes = async ({
  _id,
  page = 0,
  limit = 1,
  filter,
  noteName = 'notesCreated'
}) => {
  const notesFiltered = await UserModel.findOne({
    isActive: true,
    _id
  }).populate({
    path: `${noteName}.noteId`,
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
  });
  // .populate({
  //   path: noteName,
  //   options: {
  //     limit,
  //     sort: {
  //       createdAt: -1
  //     },
  //     skip: page == 0 ? 0 : page * limit
  //   }
  // })

  return notesFiltered[noteName];
};

module.exports = {
  getOne,
  createOne,
  getAllNotes
};

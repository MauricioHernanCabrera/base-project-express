const { UserModel } = require('./../models');
const bcrypt = require('bcrypt');

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

module.exports = {
  getOne,
  createOne
};

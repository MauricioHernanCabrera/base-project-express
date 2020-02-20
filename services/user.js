const { UserModel } = require('./../models');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');

const getOne = ({
  filter,
  select = '',
  failText = '¡No se encontro el usuario!',
  hasFail = true
}) => {
  let cursor = UserModel.findOne(filter).select(select);
  if (hasFail) cursor = cursor.orFail(boom.notFound(failText));

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


module.exports = {
  getOne,
  createOne,
  updateOne
};

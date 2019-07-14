const { SubjectModel } = require('./../models');
const boom = require('@hapi/boom');
const removeAccent = require('./../utils/removeAccent');

const getOne = ({ _id }) => {
  return SubjectModel.findById(_id).orFail(
    boom.notFound('¡No se encontro la materia!')
  );
};

const createOne = data => {
  const nameSort = removeAccent(data.name);
  return SubjectModel.create({ ...data, nameSort });
};

const deleteOne = ({ _id }) => {
  return SubjectModel.deleteOne({ _id });
};

module.exports = {
  getOne,
  createOne,
  deleteOne
};

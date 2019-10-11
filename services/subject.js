const { SubjectModel } = require('./../models');
const boom = require('@hapi/boom');
const removeAccent = require('./../utils/removeAccent');

const getOne = ({ filter }) => {
  return SubjectModel.findOne(filter).orFail(
    boom.notFound('¡No se encontro la materia!')
  );
};

const createOne = ({ data }) => {
  const nameSort = removeAccent(data.name);
  return SubjectModel.create({ ...data, nameSort });
};

const deleteOne = ({ filter }) => {
  return SubjectModel.deleteOne({ filter });
};

module.exports = {
  getOne,
  createOne,
  deleteOne
};

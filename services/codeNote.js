const { CodeNoteModel } = require('./../models');
const boom = require('@hapi/boom');

const getAll = () => {
  return CodeNoteModel.find()
    .select(['_id', 'name'])
    .sort('name');
};

const getOne = ({ _id }) => {
  return CodeNoteModel.findById(_id).orFail(
    boom.notFound('¡No se encontro el codigo de nota!')
  );
};

module.exports = {
  getAll,
  getOne
};

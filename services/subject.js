const { SubjectModel } = require('./../models');
const boom = require('@hapi/boom');

const getOne = ({ _id }) => {
  return SubjectModel.findById(_id).orFail(
    boom.notFound('¡No se encontro la materia!')
  );
};

module.exports = {
  getOne
};

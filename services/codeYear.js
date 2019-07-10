const { CodeYearModel } = require('./../models');
const boom = require('@hapi/boom');

const getAll = () => {
  return CodeYearModel.find()
    .select(['_id', 'name'])
    .sort('-name');
};

const getOne = ({ _id }) => {
  return CodeYearModel.findById(_id).orFail(
    boom.notFound('¡No se encontro el codigo de año!')
  );
};

module.exports = {
  getAll,
  getOne
};

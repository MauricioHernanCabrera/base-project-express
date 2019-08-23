const Joi = require('@hapi/joi');

const createOne = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = {
  createOne
};

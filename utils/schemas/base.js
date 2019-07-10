const Joi = require('@hapi/joi');

const idSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

module.exports = {
  idSchema
};

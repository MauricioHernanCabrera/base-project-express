const Joi = require('@hapi/joi');

const id = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

module.exports = {
  id
};

const Joi = require('@hapi/joi');

const registerAuthSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

const forgotSchema = Joi.object().keys({
  email: Joi.string().required()
});

const resetSchema = Joi.object().keys({
  password: Joi.string().required()
});

module.exports = {
  registerAuthSchema,
  forgotSchema,
  resetSchema
};

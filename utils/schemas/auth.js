const Joi = require('@hapi/joi');

const register = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

const forgot = Joi.object().keys({
  email: Joi.string().required()
});

const reset = Joi.object().keys({
  password: Joi.string().required()
});

module.exports = {
  register,
  forgot,
  reset
};

const Joi = require('@hapi/joi');

const createInstitutionSchema = Joi.object().keys({
  name: Joi.string().required()
});

const createSubjectSchema = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = {
  createInstitutionSchema,
  createSubjectSchema
};

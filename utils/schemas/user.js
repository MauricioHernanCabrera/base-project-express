const Joi = require('@hapi/joi');

// const createInstitutionSchema = Joi.object().keys({
//   name: Joi.string().required()
// });

// const createSubjectSchema = Joi.object().keys({
//   name: Joi.string().required()
// });

const getNotesQuery = Joi.object().keys({
  noteName: Joi.string()
    .valid('created', 'favorites', 'saved')
    .optional(),
  page: Joi.number().optional()
});

module.exports = {
  getNotesQuery
};

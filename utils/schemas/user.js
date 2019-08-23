const Joi = require('@hapi/joi');

const filterNoteQuery = Joi.object().keys({
  noteName: Joi.string()
    .valid('created', 'favorites', 'saved')
    .optional(),
  page: Joi.number().optional()
});

module.exports = {
  filterNoteQuery
};

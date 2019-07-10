const { idSchema } = require('./base');
const Joi = require('@hapi/joi');

const createNoteSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string()
    .allow('')
    .optional(),
  googleFolderId: Joi.string().required(),
  codeNote: idSchema,
  codeYear: idSchema,
  subject: idSchema
});

module.exports = {
  createNoteSchema
};

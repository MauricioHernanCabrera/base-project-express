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

const updateNoteSchema = Joi.object().keys({
  title: Joi.string()
    .allow('')
    .optional(),
  description: Joi.string()
    .allow('')
    .optional(),
  googleFolderId: Joi.string()
    .allow('')
    .optional(),
  codeNote: idSchema.optional(),
  codeYear: idSchema.optional(),
  subject: idSchema.optional()
});

module.exports = {
  createNoteSchema,
  updateNoteSchema
};

const BaseSchema = require('./base');
const Joi = require('@hapi/joi');

const createOne = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string()
    .allow('')
    .optional(),
  codeNote: BaseSchema.id,
  codeYear: BaseSchema.id,
  subject: BaseSchema.id
});

const updateOne = Joi.object().keys({
  title: Joi.string()
    .allow('')
    .optional(),
  description: Joi.string()
    .allow('')
    .optional(),
  codeNote: BaseSchema.id.optional(),
  codeYear: BaseSchema.id.optional(),
  subject: BaseSchema.id.optional()
});

const filterParams = Joi.object().keys({
  codeYear: BaseSchema.id.optional(),
  codeNote: BaseSchema.id.optional(),
  subject: BaseSchema.id.optional(),
  institution: BaseSchema.id.optional(),
  search: Joi.string().optional(),
  page: Joi.string().optional()
});

module.exports = {
  createOne,
  updateOne,
  filterParams
};

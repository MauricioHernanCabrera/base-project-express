const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');
const removeAccent = require('./../utils/removeAccent');

const SubjectSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },

    nameSort: {
      type: String,
      index: true,
      required: true
    },

    institution: {
      type: ObjectId,
      ref: 'Institutions',
      required: true
    }
  },
  { timestamps: true }
);

SubjectSchema.index({ name: 1, institution: 1 }, { unique: true });

SubjectSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

SubjectSchema.pre('validate', function() {
  this.nameSort = removeAccent(this.name);
});

SubjectSchema.post('save', handleUniqueValidator);

module.exports = mongoose.model('Subjects', SubjectSchema);

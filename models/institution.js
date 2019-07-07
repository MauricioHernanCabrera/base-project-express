const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');
const removeAccent = require('./../utils/removeAccent');

const InstitutionSchema = Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      uniqueCaseInsensitive: true,
      required: true
    },

    nameSort: {
      type: String,
      index: true,
      required: true
    },

    subjects: [
      {
        type: ObjectId,
        ref: 'Subjects',
        default: []
      }
    ]
  },
  { timestamps: true }
);

InstitutionSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

// Por alguna extraña razon no puedo ejecutar esto en .pre('save') y bueno funciono aca
InstitutionSchema.pre('validate', function() {
  this.nameSort = removeAccent(this.name);
});

InstitutionSchema.post('save', handleUniqueValidator);

module.exports = mongoose.model('Institutions', InstitutionSchema);

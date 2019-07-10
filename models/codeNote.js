const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const CodeNoteSchema = Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    uniqueCaseInsensitive: true,
    required: true
  }
});

CodeNoteSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

CodeNoteSchema.post('save', handleUniqueValidator);

module.exports = mongoose.model('CodeNotes', CodeNoteSchema);

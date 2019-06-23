const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeNoteSchema = Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true
  }
});

module.exports = mongoose.model('CodeNotes', CodeNoteSchema);

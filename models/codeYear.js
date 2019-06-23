const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeYearSchema = Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true
  }
});

module.exports = mongoose.model('CodeYears', CodeYearSchema);

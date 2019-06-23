const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const InstitutionSchema = Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
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

module.exports = mongoose.model('Institutions', InstitutionSchema);

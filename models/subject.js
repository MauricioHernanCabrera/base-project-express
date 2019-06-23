const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SubjectSchema = Schema(
  {
    name: {
      type: String,
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

module.exports = mongoose.model('Subjects', SubjectSchema);

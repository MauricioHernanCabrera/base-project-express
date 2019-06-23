const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const NoteSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    googleFolderId: {
      type: String,
      required: true
    },

    owner: {
      type: ObjectId,
      ref: 'Users',
      required: true
    },

    codeNote: {
      type: ObjectId,
      ref: 'CodeNotes',
      required: true
    },

    codeYear: {
      type: ObjectId,
      ref: 'CodeYears',
      required: true
    },

    subject: {
      type: ObjectId,
      ref: 'Subjects',
      required: true
    },

    favorites: [
      {
        type: ObjectId,
        ref: 'Users',
        default: []
      }
    ],

    saved: [
      {
        type: ObjectId,
        ref: 'Users',
        default: []
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notes', NoteSchema);

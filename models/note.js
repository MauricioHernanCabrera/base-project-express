const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const UserMoreTimestampsSchema = Schema(
  {
    user: {
      type: ObjectId,
      ref: 'Users',
      required: true
    }
  },
  { timestamps: true }
);

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
        type: UserMoreTimestampsSchema,
        default: []
      }
    ],

    saved: [
      {
        type: UserMoreTimestampsSchema,
        default: []
      }
    ]
  },
  { timestamps: true }
);

NoteSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

NoteSchema.post('save', handleUniqueValidator);

module.exports = mongoose.model('Notes', NoteSchema);

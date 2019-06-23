const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },

    username: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    email: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    urlImg: {
      type: String,
      default: ''
    },

    notesFavorites: [
      {
        type: ObjectId,
        ref: 'Notes',
        default: []
      }
    ],

    notesSaved: [
      {
        type: ObjectId,
        ref: 'Notes',
        default: []
      }
    ],

    notesCreated: [
      {
        type: ObjectId,
        ref: 'Notes',
        default: []
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', UserSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const NoteMoreTimestampsSchema = Schema(
  {
    note: {
      type: ObjectId,
      ref: 'Notes',
      required: true
    }
  },
  { timestamps: true }
);

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
      uniqueCaseInsensitive: true,
      required: true
    },

    email: {
      type: String,
      unique: true,
      index: true,
      uniqueCaseInsensitive: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    // avatar: {
    //   type: String,
    //   default: ''
    // },

    favorites: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ],

    saved: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ],

    created: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ],

    resetPasswordToken: { type: String, default: '' },

    resetPasswordExpires: { type: Date, default: Date.now() }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

UserSchema.post('save', handleUniqueValidator);

module.exports = mongoose.model('Users', UserSchema);

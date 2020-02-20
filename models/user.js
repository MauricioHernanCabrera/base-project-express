const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const UserSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
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

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

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

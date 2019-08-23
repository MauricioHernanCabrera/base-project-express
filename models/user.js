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

    // facebookProvider: {
    //   type: {
    //     id: String,
    //     token: String
    //   },

    //   select: false
    // }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

UserSchema.post('save', handleUniqueValidator);

// UserSchema.statics.upsertFbUser = function(
//   accessToken,
//   refreshToken,
//   profile,
//   cb
// ) {
//   return this.findOne(
//     {
//       'facebookProvider.id': profile.id
//     },
//     async (err, user) => {
//       console.log(profile);

//       if (!user) {
//         const newUser = this({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           password: 'asdasdasdasd',
//           facebookProvider: {
//             id: profile.id,
//             token: accessToken
//           }
//         });

//         try {
//           const savedUser = await newUser.save();
//           cb(null, savedUser);
//         } catch (error) {
//           cb(error, user);
//         }
//       } else {
//         return cb(err, user);
//       }
//     }
//   );
// };

module.exports = mongoose.model('Users', UserSchema);

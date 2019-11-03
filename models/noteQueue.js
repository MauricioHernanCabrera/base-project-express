const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const FileSchema = Schema({
  path: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  mimeType: {
    type: String,
    required: true
  }
});

const NoteQueueSchema = Schema(
  {
    googleFolderId: {
      type: String,
      required: true
    },

    // user: {
    //   type: ObjectId,
    //   ref: 'Users',
    //   required: true
    // },

    note: {
      type: ObjectId,
      ref: 'Notes',
      required: true
    },

    file: {
      type: FileSchema,
      required: true
    },

    isPending: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotesQueue', NoteQueueSchema);

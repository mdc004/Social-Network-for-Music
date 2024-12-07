const mongoose = require('mongoose');
const playlistValidation = require('./../utils/validation/playlist');
const { updateTimestamp, updateTimestampForUpdate } = require('./../middlewares/timestamp');

/**
 * Schema definition for a Playlist in MongoDB.
 * @typedef {Object} Playlist
 * @property {string} title - The title of the playlist.
 * @property {string} [description] - A brief description of the playlist.
 * @property {string[]} [tags] - An array of tags associated with the playlist.
 * @property {string[]} [songs] - An array of song IDs included in the playlist.
 * @property {mongoose.Schema.Types.ObjectId} owner - The ID of the user who owns the playlist.
 * @property {boolean} [public=true] - Indicates whether the playlist is public or private.
 * @property {Date} [createdAt] - The date and time when the playlist was created.
 * @property {Date} [updatedAt] - The date and time when the playlist was last updated.
 */

/**
 * Mongoose Schema for a Playlist.
 * @type {mongoose.Schema}
 */
const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    match: [playlistValidation.title.pattern, playlistValidation.title.description]
  },
  description: {
    type: String,
    match: [playlistValidation.description.pattern, playlistValidation.description.description]
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: playlistValidation.tags.isValid,
      message: playlistValidation.tags.description
    }
  },
  songs: {
    type: [String],
    default: [],
    validate: {
      validator: playlistValidation.songs.isValid,
      message: playlistValidation.songs.description
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
    validate: {
      validator: playlistValidation.owner.isValid,
      message: playlistValidation.owner.description
    }
  },
  public: {
    type: Boolean,
    default: true,
    validate: {
      validator: playlistValidation.public.isValid,
      message: playlistValidation.public.description
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: playlistValidation.createdAt.isValid,
      message: playlistValidation.createdAt.description
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: playlistValidation.updatedAt.isValid,
      message: playlistValidation.updatedAt.description
    }
  }
});

/**
 * Middleware to update the `updatedAt` timestamp before saving a document.
 */
playlistSchema.pre('save', updateTimestamp);

/**
 * Middleware to update the `updatedAt` timestamp before finding and updating a document.
 */
playlistSchema.pre('findOneAndUpdate', updateTimestampForUpdate);

/**
 * Playlist model compiled from the schema.
 * @type {mongoose.Model<Playlist>}
 */
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
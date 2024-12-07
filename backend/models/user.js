const mongoose = require('mongoose');
const userValidation = require('../utils/validation/user');

/**
 * Schema definition for a User in MongoDB.
 * @typedef {Object} User
 * @property {string} email - The user's email address.
 * @property {string} username - The user's unique username.
 * @property {string} password - The user's hashed password.
 * @property {string} status - The user's account status. Can be 'active', 'inactive', or 'banned'.
 * @property {string} role - The user's role. Can be 'user', 'admin', or 'superadmin'.
 * @property {Date} createdAt - The date and time when the user was created.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} [info] - Additional information about the user.
 * @property {Object} preferences - The user's preferences.
 * @property {string[]} preferences.artists - An array of preferred artist IDs.
 * @property {mongoose.Schema.Types.ObjectId[]} preferences.following - An array of IDs of users the user is following.
 * @property {string[]} preferences.genres - An array of preferred genre tags.
 * @property {mongoose.Schema.Types.ObjectId[]} preferences.playlists - An array of IDs of the user's playlists.
 */

/**
 * Mongoose Schema for a User.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [userValidation.email.pattern, userValidation.email.description]
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    match: [userValidation.username.pattern, userValidation.username.description]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // Passwords are hashed, so pattern validation is not applicable
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    default: 'active',
    enum: ['active', 'inactive', 'banned'] // Status can only be one of these values
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    default: 'user',
    enum: ['user', 'admin', 'superadmin'] // Role can only be one of these values
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true // Timestamp when the user was created
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    match: [userValidation.firstName.pattern, userValidation.firstName.description]
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    match: [userValidation.lastName.pattern, userValidation.lastName.description]
  },
  info: {
    type: String,
    default: '',
    match: [userValidation.info.pattern, userValidation.info.description] // Optional additional information
  },
  preferences: {
    artists: {
      type: [String],
      default: [],
      validate: {
        validator: userValidation.preferences.artists.isValid,
        message: userValidation.preferences.artists.description
      }
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      validate: {
        validator: userValidation.preferences.following.isValid,
        message: userValidation.preferences.following.description
      }
    },
    genres: {
      type: [String],
      default: [],
      validate: {
        validator: userValidation.preferences.genres.isValid, // Validation for genre preferences
        message: userValidation.preferences.genres.description
      }
    },
    playlists: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Playlist',
      default: [],
      validate: {
        validator: userValidation.preferences.playlists.isValid,
        message: userValidation.preferences.playlists.description
      }
    }
  }
});

/**
 * User model compiled from the schema.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
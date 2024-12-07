const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * Middleware to handle serving user avatar images.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const users = (req, res, next) => {
  const avatarsPath = config.AVATAR_PATHS.USERS;
  const defaultFile = path.join(avatarsPath, '0.jpg');
  const requestedFile = path.join(avatarsPath, req.params.filename);

  fs.stat(requestedFile, (err, stats) => {
    if (err || !stats.isFile()) {
      res.sendFile(defaultFile);
    } else {
      res.sendFile(requestedFile);
    }
  });
};

/**
 * Middleware to handle serving playlist avatar images.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const playlists = (req, res, next) => {
  const avatarsPath = config.AVATAR_PATHS.PLAYLISTS;
  const defaultFile = path.join(avatarsPath, '0.jpg');
  const requestedFile = path.join(avatarsPath, req.params.filename);

  fs.stat(requestedFile, (err, stats) => {
    if (err || !stats.isFile()) {
      res.sendFile(defaultFile);
    } else {
      res.sendFile(requestedFile);
    }
  });
};

module.exports = {
  users,
  playlists
};
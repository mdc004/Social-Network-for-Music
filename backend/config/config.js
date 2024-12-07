const path = require('path');

// Base paths
const BASE_UPLOAD_PATH = path.join(__dirname, '..', 'uploads');
const FRONTEND_PATH = path.join(__dirname, '..', '..', 'frontend');

// Avatar paths
const AVATAR_PATHS = {
  USERS: path.join(BASE_UPLOAD_PATH, 'avatars', 'users'),
  PLAYLISTS: path.join(BASE_UPLOAD_PATH, 'avatars', 'playlists')
};

module.exports = {
  BASE_UPLOAD_PATH,
  FRONTEND_PATH,
  AVATAR_PATHS
};
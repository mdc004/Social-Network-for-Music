const path = require('path')
const config = require(`./../config/config`)


// Path for user avatars
const AVATAR_PATH = path.join(config.BASE_UPLOAD_PATH, 'avatars', 'users')

// Path for playlist avatars
const PLAYLIST_AVATAR_PATH = path.join(config.BASE_UPLOAD_PATH, 'avatars', 'playlists')

/**
 * Constructs the path for a user's avatar.
 * @param {string} userId - The ID of the user
 * @returns {string} - The path to the user's avatar
 */
const getUserAvatarPath = (userId) => {
  return path.join(AVATAR_PATH, `${userId}.jpg`)
}

module.exports.user = getUserAvatarPath

/**
 * Constructs the path for a playlist's avatar.
 * @param {string} playlistId - The ID of the playlist
 * @returns {string} - The path to the playlist's avatar
 */
const getPlaylistAvatarPath = (playlistId) => {
  return path.join(PLAYLIST_AVATAR_PATH, `${playlistId}.jpg`)
}

module.exports.playlist = getPlaylistAvatarPath
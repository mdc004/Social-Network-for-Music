const mongoose = require('mongoose');
const userValidation = require('../utils/validation/user');
const playlistValidation = require('../utils/validation/playlist');

/**
 * Middleware function for validating request parameters and body fields.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void} Calls `next()` if validation passes, otherwise responds with an error.
 */
const validator = async (req, res, next) => {
  try {
    // Extract parameters from request
    const userId = req.params.userId;
    const genreId = req.params.genreId;
    const artistId = req.params.artistId;
    const playlistId = req.params.playlistId;
    const songId = req.params.songId;
    const tag = req.params.tag;

    // Extract body fields from request
    const { email, username, password, oldPassword, newPassword, firstName, lastName, genres, artists, info, playlists } = req.body;
    const { title, description, tags, public, songs } = req.body;

    // Validate UserID
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: { message: 'Invalid user Id format' } });
    }

    // Validate Passwords
    if (password && !userValidation.password.isValid(password)) {
      return res.status(400).json({ error: { message: userValidation.password.description } });
    }
    if (oldPassword && !userValidation.password.isValid(oldPassword)) {
      return res.status(400).json({ error: { message: userValidation.password.description } });
    }
    if (newPassword && !userValidation.password.isValid(newPassword)) {
      return res.status(400).json({ error: { message: userValidation.password.description } });
    }

    // Validate Email
    if (email && !userValidation.email.isValid(email)) {
      return res.status(400).json({ error: { message: userValidation.email.description } });
    }

    // Validate Username
    if (username && !userValidation.username.isValid(username)) {
      return res.status(400).json({ error: { message: userValidation.username.description } });
    }

    // Validate First Name
    if (firstName && !userValidation.firstName.isValid(firstName)) {
      return res.status(400).json({ error: { message: userValidation.firstName.description } });
    }

    // Validate Last Name
    if (lastName && !userValidation.lastName.isValid(lastName)) {
      return res.status(400).json({ error: { message: userValidation.lastName.description } });
    }

    // Validate Info
    if (info && !userValidation.info.isValid(info)) {
      return res.status(400).json({ error: { message: userValidation.info.description } });
    }

    // Validate Single Genre
    if (genreId) {
      const isValidGenre = await userValidation.preference.genre.isValid(genreId);
      if (!isValidGenre) {
        return res.status(400).json({ error: { message: userValidation.preference.genre.description } });
      }
    }

    // Validate Multiple Genres
    if (genres) {
      const isValidGenres = await userValidation.preferences.genres.isValid(genres);
      if (!isValidGenres) {
        return res.status(400).json({ error: { message: userValidation.preferences.genres.description } });
      }
    }

    // Validate Single Artist
    if (artistId) {
      const isValidArtistId = await userValidation.preference.artist.isValid(artistId);
      if (!isValidArtistId) {
        return res.status(400).json({ error: { message: userValidation.preference.artist.description } });
      }
    }

    // Validate Multiple Artists
    if (artists) {
      const isValidArtists = await userValidation.preferences.artists.isValid(artists);
      if (!isValidArtists) {
        return res.status(400).json({ error: { message: userValidation.preferences.artists.description } });
      }
    }

    // Validate Single Playlist
    if (playlistId && !userValidation.preference.playlist.isValid(playlistId)) {
      return res.status(400).json({ error: { message: userValidation.preference.playlist.description } });
    }

    // Validate Multiple Playlists
    if (playlists && !userValidation.preferences.playlists.isValid(playlists)) {
      return res.status(400).json({ error: { message: userValidation.preferences.playlists.description } });
    }

    // Validate Playlist Title
    if (title && !playlistValidation.title.isValid(title)) {
      return res.status(400).json({ error: { message: playlistValidation.title.description } });
    }

    // Validate Playlist Description
    if (description && !playlistValidation.description.isValid(description)) {
      return res.status(400).json({ error: { message: playlistValidation.description.description } });
    }

    // Validate Single Tag
    if (tag) {
      const isValidTag = await playlistValidation.tag.isValid(tag);
      if (!isValidTag) {
        return res.status(400).json({ error: { message: playlistValidation.tag.description } });
      }
    }

    // Validate Multiple Tags
    if (tags) {
      const isValidTags = await playlistValidation.tags.isValid(tags);
      if (!isValidTags) {
        return res.status(400).json({ error: { message: playlistValidation.tags.description } });
      }
    }

    // Validate Public Status
    if (public && !playlistValidation.public.isValid(public)) {
      return res.status(400).json({ error: { message: playlistValidation.public.description } });
    }

    // Validate Single Song
    if (songId) {
      const isValidSongId = await playlistValidation.song.isValid(songId);
      if (!isValidSongId) {
        return res.status(400).json({ error: { message: playlistValidation.song.description } });
      }
    }

    // Validate Multiple Songs
    if (songs) {
      const isValidSongs = await playlistValidation.songs.isValid(songs);
      if (!isValidSongs) {
        return res.status(400).json({ error: { message: playlistValidation.songs.description } });
      }
    }

    // Proceed to next middleware if validation passes
    next();
  } catch (error) {
    // Log the error and respond with a server error
    console.error(error.message);
    console.log(`*************************************`);
    return res.status(500).json({ error: { message: `It's not you, it's us` } });
  }
};

module.exports = validator;
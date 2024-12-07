const bcrypt = require('bcrypt');
const User = require('../models/user');
const Playlist = require('../models/playlist');
const fs = require('fs');
const avatarPath = require('../utils/avatar');

/**
 * @function show
 * @description Retrieves the details of the currently authenticated user.
 * @param {Object} req - The request object, containing user information in `req.user`.
 * @param {Object} res - The response object used to send the user details or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue retrieving user details.
 */
module.exports.show = async (req, res) => {
  try {
    const { _id, username, firstName, lastName, createdAt, info, preferences } = req.user;
    res.status(200).json({ _id, username, firstName, lastName, createdAt, info, preferences });
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    res.status(500).json({ error: { message: "It's not about you it's us" } });
  }
};

/**
 * @function showPlaylists
 * @description Retrieves the playlists of a specific user, filtering out non-public playlists if the request is not made by the user themselves.
 * @param {Object} req - The request object, containing `req.userId` and `req.params.userId`.
 * @param {Object} res - The response object used to send the playlists or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue retrieving playlists.
 */
module.exports.showPlaylists = async (req, res) => {
  try {
    const loggedUserId = req.userId;
    const userId = req.params.userId;

    let playlists = await Playlist.find({ owner: userId });

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: 'No playlists found for this user' });
    }

    if (loggedUserId !== userId) {
      playlists = playlists.filter((playlist) => playlist.public);
    }

    if (playlists.length === 0) {
      return res.status(404).json({ error: 'No public playlists found for this user' });
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    res.status(500).json({ error: { message: "It's not about you it's us" } });
  }
};

/**
 * @function create
 * @description Creates a new user with the provided details.
 * @param {Object} req - The request object, containing user details in `req.body`.
 * @param {Object} res - The response object used to send the result of the user creation or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue creating the user, including validation errors or duplicate entries.
 */
module.exports.create = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, info } = req.body;

    if (!email) return res.status(400).json({ error: { message: 'Email is required' } });
    if (!username) return res.status(400).json({ error: { message: 'Username is required' } });
    if (!password) return res.status(400).json({ error: { message: 'Password is required' } });
    if (!firstName) return res.status(400).json({ error: { message: 'First name is required' } });
    if (!lastName) return res.status(400).json({ error: { message: 'Last name is required' } });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      info,
    });

    await user.save();
    return res.status(201).json({ userId: user._id } );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: { message: 'Username or email already exists' } });
    } else if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      console.log(errorMessages.join(', '));
      console.log('*************************************');
      return res.status(400).json({ error: { message: 'Validation error. Try again. If the problem persists contact the administrator' } });
    } else {
      console.error(error.message);
      console.log('*************************************');
      return res.status(500).json({ error: { message: "It's not you, it's us" } });
    }
  }
};

/**
 * @function updatePassword
 * @description Updates the password of the currently authenticated user.
 * @param {Object} req - The request object, containing old and new passwords in `req.body`.
 * @param {Object} res - The response object used to send the result of the password update or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue updating the password, including incorrect old passwords.
 */
module.exports.updatePassword = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) return res.status(400).json({ error: { message: 'Old password is required' } });
    if (!newPassword) return res.status(400).json({ error: { message: 'New password is required' } });

    const isMatch = await bcrypt.compare(oldPassword, userLogged.password);
    if (isMatch) {
      userLogged.password = await bcrypt.hash(newPassword, 10);
      await userLogged.save();
      return res.status(204).send();
    } else {
      return res.status(400).json({ error: { message: 'Old password is incorrect' } });
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function updateProfile
 * @description Updates the profile information of the currently authenticated user.
 * @param {Object} req - The request object, containing new profile details in `req.body`.
 * @param {Object} res - The response object used to send the result of the profile update or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue updating the profile, including missing required fields.
 */
module.exports.updateProfile = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const { firstName, lastName, info } = req.body;

    if (!firstName) return res.status(400).json({ error: { message: 'First name is required' } });
    if (!lastName) return res.status(400).json({ error: { message: 'Last name is required' } });

    userLogged.firstName = firstName;
    userLogged.lastName = lastName;
    if (info) userLogged.info = info;

    await userLogged.save();
    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function addGenre
 * @description Adds a genre to the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing genre ID in `req.params.genreId`.
 * @param {Object} res - The response object used to send the result of the genre addition or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue adding the genre, including duplicate entries.
 */
module.exports.addGenre = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const genreId = req.params.genreId;

    if (!userLogged.preferences.genres.includes(genreId)) {
      userLogged.preferences.genres.push(genreId.toLowerCase());
      await userLogged.save();
      return res.status(204).send();
    } else {
      return res.status(400).json({ message: 'Genre already among your favourites' });
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function removeGenre
 * @description Removes a genre from the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing genre ID in `req.params.genreId`.
 * @param {Object} res - The response object used to send the result of the genre removal or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue removing the genre, including non-existing entries.
 */
module.exports.removeGenre = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const genreId = req.params.genreId;

    const index = userLogged.preferences.genres.indexOf(genreId);
    if (index === -1) {
      return res.status(404).json({ message: 'Genre not found among your favourites' });
    } else {
      userLogged.preferences.genres.splice(index, 1);
      await userLogged.save();
      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function addPlaylist
 * @description Adds a playlist to the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing playlist ID in `req.params.playlistId`.
 * @param {Object} res - The response object used to send the result of the playlist addition or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue adding the playlist, including duplicate entries.
 */
module.exports.addPlaylist = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const playlistId = req.params.playlistId;

    if (!userLogged.preferences.playlists.includes(playlistId)) {
      userLogged.preferences.playlists.push(playlistId);
      await userLogged.save();
      return res.status(204).send();
    } else {
      return res.status(400).json({ message: 'Playlist already among your favourites' });
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function removePlaylist
 * @description Removes a playlist from the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing playlist ID in `req.params.playlistId`.
 * @param {Object} res - The response object used to send the result of the playlist removal or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue removing the playlist, including non-existing entries.
 */
module.exports.removePlaylist = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const playlistId = req.params.playlistId;

    const index = userLogged.preferences.playlists.indexOf(playlistId);
    if (index === -1) {
      return res.status(404).json({ message: 'Playlist not found among your favourites' });
    } else {
      userLogged.preferences.playlists.splice(index, 1);
      await userLogged.save();
      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function addArtist
 * @description Adds an artist to the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing artist ID in `req.params.artistId`.
 * @param {Object} res - The response object used to send the result of the artist addition or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue adding the artist, including duplicate entries.
 */
module.exports.addArtist = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const artistId = req.params.artistId;

    if (!userLogged.preferences.artists.includes(artistId)) {
      userLogged.preferences.artists.push(artistId);
      await userLogged.save();
      return res.status(204).send();
    } else {
      return res.status(400).json({ message: 'Artist already among your favourites' });
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function removeArtist
 * @description Removes an artist from the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing artist ID in `req.params.artistId`.
 * @param {Object} res - The response object used to send the result of the artist removal or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue removing the artist, including non-existing entries.
 */
module.exports.removeArtist = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const artistId = req.params.artistId;

    const index = userLogged.preferences.artists.indexOf(artistId);
    if (index === -1) {
      return res.status(404).json({ message: 'Artist not found among your favourites' });
    } else {
      userLogged.preferences.artists.splice(index, 1);
      await userLogged.save();
      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function addUser
 * @description Adds a user to the list of following for the currently authenticated user.
 * @param {Object} req - The request object, containing playlist ID in `req.params.userId`.
 * @param {Object} res - The response object used to send the result of the user addition or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue adding the user, including duplicate entries.
 */
module.exports.addUser = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const userToFollowId = req.params.userId;

    if (!userLogged.preferences.following.includes(userToFollowId)) {
      userLogged.preferences.following.push(userToFollowId);
      await userLogged.save();
      return res.status(204).send();
    } else {
      return res.status(400).json({ message: 'User already among your following' });
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function removeUser
 * @description Removes an user from the list of favourites for the currently authenticated user.
 * @param {Object} req - The request object, containing artist ID in `req.params.userId`.
 * @param {Object} res - The response object used to send the result of the artist removal or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue removing the artist, including non-existing entries.
 */
module.exports.removeUser = async (req, res) => {
  try {
    const userLogged = req.userLogged;
    const userToUnfollowId = req.params.userId;

    const index = userLogged.preferences.following.indexOf(userToUnfollowId);
    if (index === -1) {
      return res.status(404).json({ message: 'User not found among your following' });
    } else {
      userLogged.preferences.following.splice(index, 1);
      await userLogged.save();
      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function addAvatar
 * @description Uploads a new avatar for the currently authenticated user.
 * @param {Object} req - The request object, containing the uploaded file in `req.file`.
 * @param {Object} res - The response object used to send the result of the avatar upload or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue uploading the avatar, including no file uploaded.
 */
exports.addAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });

    fs.renameSync(req.file.path, avatarPath.user(userId));
    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function removeAvatar
 * @description Removes the avatar of the currently authenticated user.
 * @param {Object} req - The request object, containing user ID in `req.userId`.
 * @param {Object} res - The response object used to send the result of the avatar removal or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue removing the avatar.
 */
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    if (fs.existsSync(avatarPath.user(userId))) {
      fs.unlinkSync(avatarPath.user(userId));
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * @function delete
 * @description Deletes the currently authenticated user's account and all associated data.
 * @param {Object} req - The request object, containing user ID in `req.userId`.
 * @param {Object} res - The response object used to send the result of the user deletion or an error message.
 * @returns {void}
 * @throws {Error} If there's an issue deleting the user or associated data.
 */
module.exports.delete = async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.userLogged;

    if (fs.existsSync(avatarPath.user(userId))) {
      fs.unlinkSync(avatarPath.user(userId));
    }

    const playlists = await Playlist.find({ owner: userId });

    playlists.forEach(playlist => {
      if (fs.existsSync(avatarPath.playlist(playlist._id))) {
        fs.unlinkSync(avatarPath.playlist(playlist._id));
      }
    });

    await Playlist.deleteMany({ owner: userId });
    await user.deleteOne();

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

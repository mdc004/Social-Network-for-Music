const Playlist = require('./../models/playlist');
const avatarPath = require('./../utils/avatar');
const fs = require('fs');

/**
 * Retrieves and returns a playlist.
 * 
 * Checks if the playlist is public or if the current user is the owner of 
 * the playlist before returning it. Returns a 403 status if the playlist 
 * is private and the user is not the owner.
 * 
 * @async
 * @function show
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with the playlist details 
 * or an error response if the playlist cannot be accessed.
 * @throws {Error} Throws an error if there is an issue retrieving the playlist.
 */
module.exports.show = async (req, res) => {
  try {
    const userId = req.userId;
    const playlist = req.playlist;

    // if the playlist is private only the owner can see it
    if (!playlist.public && playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `The playlist isn't public` } });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Creates a new playlist.
 * 
 * Validates the request body for required fields and creates a new playlist 
 * with the provided details. Returns the ID of the created playlist.
 * 
 * @async
 * @function create
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with the ID of the newly 
 * created playlist or an error response if the playlist cannot be created.
 * @throws {Error} Throws an error if there is an issue creating the playlist.
 */
module.exports.create = async (req, res) => {
  try {
    console.error(`Passed from create controller`);
    console.log(`*************************************`);
    const owner = req.userId;

    const { title, description, tags, public: isPublic, songs } = req.body;

    if (!title) {
      return res.status(400).json({ error: { message: `Title is required` } });
    }

    const playlist = new Playlist({
      title,
      description,
      tags,
      owner,
      public: isPublic,
      songs
    });

    await playlist.save();

    res.status(201).json({ playlistId: playlist._id });
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Changes the visibility of a playlist.
 * 
 * Updates the visibility (public/private) of the playlist based on the request 
 * body. Only the owner of the playlist can change its visibility.
 * 
 * @async
 * @function changeVisibility
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the 
 * visibility is successfully updated or an error response if the update fails.
 * @throws {Error} Throws an error if there is an issue updating the playlist's visibility.
 */
module.exports.changeVisibility = async (req, res) => {
  try {
    const userId = req.userId;
    const playlist = req.playlist;

    const { public: isPublic } = req.body;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `You do not have permission to update this playlist` } });
    }

    playlist.public = isPublic !== undefined ? isPublic : !playlist.public;

    await playlist.save();

    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Updates the information of a playlist.
 * 
 * Updates the title, description, tags, and other details of the playlist. 
 * Only the owner of the playlist can update its information.
 * 
 * @async
 * @function updateInfo
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with the updated playlist 
 * or an error response if the update fails.
 * @throws {Error} Throws an error if there is an issue updating the playlist information.
 */
module.exports.updateInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const playlist = req.playlist;

    const { title, description, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: { message: `Title and description are required` } });
    }

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `You do not have permission to update this playlist` } });
    }

    playlist.title = title;
    playlist.description = description;
    playlist.tags = tags;

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Deletes a playlist.
 * 
 * Deletes the playlist from the database and removes any associated avatar 
 * file if it exists. Only the owner of the playlist can delete it.
 * 
 * @async
 * @function delete
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the 
 * playlist is successfully deleted or an error response if the deletion fails.
 * @throws {Error} Throws an error if there is an issue deleting the playlist.
 */
module.exports.delete = async (req, res) => {
  try {
    const userId = req.userId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `You do not have permission to delete this playlist` } });
    }

    if (fs.existsSync(avatarPath.playlist(playlist._id))) {
      fs.unlinkSync(avatarPath.playlist(playlist._id));
    }

    await playlist.deleteOne();

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Adds a song to a playlist.
 * 
 * Adds the specified song to the playlist. Only the owner of the playlist 
 * can add songs. Returns a 400 status if the song is already in the playlist.
 * 
 * @async
 * @function addSong
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the song 
 * is successfully added or an error response if the addition fails.
 * @throws {Error} Throws an error if there is an issue adding the song to the playlist.
 */
module.exports.addSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const userId = req.userId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `Only the owner of the playlist can update it` } });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);

      await playlist.save();

      return res.status(204).send();
    } else {
      return res.status(400).json({ message: `Song is already in this playlist` });
    }
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Removes a song from a playlist.
 * 
 * Removes the specified song from the playlist. Only the owner of the playlist 
 * can remove songs. Returns a 404 status if the song is not found in the playlist.
 * 
 * @async
 * @function removeSong
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the song 
 * is successfully removed or an error response if the removal fails.
 * @throws {Error} Throws an error if there is an issue removing the song from the playlist.
 */
module.exports.removeSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const userId = req.userId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `You do not have permission to update this playlist` } });
    }

    const index = playlist.songs.indexOf(songId);

    if (index === -1) {
      return res.status(404).json({ message: `Song not found in this playlist` });
    } else {
      playlist.songs.splice(index, 1);

      // Save the updated playlist
      await playlist.save();

      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Adds a tag to a playlist.
 * 
 * Adds the specified tag to the playlist. Only the owner of the playlist 
 * can add tags. Returns a 400 status if the tag is already in the playlist.
 * 
 * @async
 * @function addTag
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the tag 
 * is successfully added or an error response if the addition fails.
 * @throws {Error} Throws an error if there is an issue adding the tag to the playlist.
 */
module.exports.addTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const userId = req.userId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `Only the owner of the playlist can update it` } });
    }

    if (!playlist.tags.includes(tag)) {
      playlist.tags.push(tag);

      await playlist.save();

      return res.status(204).send();
    } else {
      return res.status(400).json({ message: `Tag is already in this playlist` });
    }
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Removes a tag from a playlist.
 * 
 * Removes the specified tag from the playlist. Only the owner of the playlist 
 * can remove tags. Returns a 404 status if the tag is not found in the playlist.
 * 
 * @async
 * @function removeTag
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the tag 
 * is successfully removed or an error response if the removal fails.
 * @throws {Error} Throws an error if there is an issue removing the tag from the playlist.
 */
module.exports.removeTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const userId = req.userId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `You do not have permission to update this playlist` } });
    }

    const index = playlist.tags.indexOf(tag);

    if (index === -1) {
      return res.status(404).json({ message: `Tag not found in this playlist` });
    } else {
      playlist.tags.splice(index, 1);

      // Save the updated playlist
      await playlist.save();

      return res.status(204).send();
    }
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    res.status(500).json({ error: { message: `It's not about you it's us` } });
  }
};

/**
 * Adds an avatar image to a playlist.
 * 
 * Moves the uploaded avatar image to the correct location. Only the owner of 
 * the playlist can add or update the avatar image.
 * 
 * @async
 * @function addAvatar
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the avatar 
 * is successfully added or an error response if the addition fails.
 * @throws {Error} Throws an error if there is an issue adding the avatar image.
 */
exports.addAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const playlistId = req.params.playlistId;
    const playlist = req.playlist;

    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: `Only the owner of the playlist can update it` } });
    }

    fs.renameSync(req.file.path, avatarPath.playlist(playlistId));

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    console.log(`*************************************`);
    return res.status(500).json({ message: `It's not you, it's us` });
  }
};

/**
 * Removes the avatar image from a playlist.
 * 
 * Deletes the avatar image associated with the playlist if it exists. Only the 
 * owner of the playlist can remove the avatar image.
 * 
 * @async
 * @function removeAvatar
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no content if the avatar 
 * is successfully removed or an error response if the removal fails.
 * @throws {Error} Throws an error if there is an issue removing the avatar image.
 */
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const playlistId = req.params.playlistId;
    const playlist = req.playlist;

    // checking if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
      return res.status(403).json({ error: { message: 'Only the owner of the playlist can update it' } });
    }

    if (fs.existsSync(avatarPath.playlist(playlistId))) {
      fs.unlinkSync(avatarPath.playlist(playlistId));
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: `It's not you, it's us` });
  }
};
const User = require('./../models/user');
const Playlist = require('./../models/playlist');

/**
 * Middleware to check if a user exists in the database.
 * 
 * This middleware function retrieves the user by their ID from the 
 * request parameters. If the user is found, it attaches the user 
 * object to the request for further use in subsequent middleware or 
 * route handlers. If the user is not found, it sends a 404 error 
 * response. If there's an error during the database query, it sends 
 * a 500 error response.
 * 
 * @async
 * @function user
 * @param {Object} req - The request object containing the user ID in 
 * the parameters.
 * @param {Object} res - The response object used to send error 
 * responses.
 * @param {Function} next - The next middleware function to call if 
 * the user is found.
 * @returns {Promise<void>} A promise that resolves when the user is 
 * found and attached to the request object, or an error response is sent.
 * @throws {Error} Throws an error if there is an issue querying the 
 * database.
 */
module.exports.user = async (req, res, next) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      // User not found, send a 404 response
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Attach user to request object for further use
    req.user = user;

    // Proceed to the next middleware function
    next();
  } catch (error) {
    // Handle any unexpected errors
    console.error(error.message);
    res.status(500).json({ error: { message: "It's not you, it's us" } });
  }
}

/**
 * Middleware to check if a playlist exists in the database.
 * 
 * This middleware function retrieves the playlist by its ID from the 
 * request parameters. If the playlist is found, it attaches the 
 * playlist object to the request for further use in subsequent middleware 
 * or route handlers. If the playlist is not found, it sends a 404 error 
 * response. If there's an error during the database query, it sends 
 * a 500 error response.
 * 
 * @async
 * @function playlist
 * @param {Object} req - The request object containing the playlist ID 
 * in the parameters.
 * @param {Object} res - The response object used to send error 
 * responses.
 * @param {Function} next - The next middleware function to call if 
 * the playlist is found.
 * @returns {Promise<void>} A promise that resolves when the playlist is 
 * found and attached to the request object, or an error response is sent.
 * @throws {Error} Throws an error if there is an issue querying the 
 * database.
 */
module.exports.playlist = async (req, res, next) => {
  try {
    // Extract playlist ID from request parameters
    const playlistId = req.params.playlistId;

    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      // Playlist not found, send a 404 response
      return res.status(404).json({ error: { message: 'Playlist not found' } });
    }

    // Attach playlist to request object for further use
    req.playlist = playlist;

    // Proceed to the next middleware function
    next();
  } catch (error) {
    // Handle any unexpected errors
    console.error(error.message);
    res.status(500).json({ error: { message: "It's not you, it's us" } });
  }
}

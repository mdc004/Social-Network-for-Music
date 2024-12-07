const spotifyService = require('../services/spotify');
const User = require('../models/user');
const Playlist = require('../models/playlist');
const playlistValidation = require('../utils/validation/playlist');

/**
 * Handles searching for Spotify elements based on a query.
 * @param {Object} req - The request object containing query and types.
 * @param {Object} res - The response object to send the results.
 */
module.exports.searchSpotifyElement = async (req, res) => {
  try {
    const query = req.params.query;
    let types = req.query.types;
    let page = req.query.page;

    // Check if query and types are provided
    if (!query) {
      return res.status(400).json({ error: { message: 'Missing query' } });
    }

    if (!types) {
      return res.status(400).json({ error: { message: 'Missing types' } });
    }

    // Set results per page and calculate skip based on zero-based page index
    const limit = 10;
    page = page ? Math.abs(parseInt(page)) : 0;

    // Validate the page parameter to be within the allowable range
    if (page * limit > 1000) {
      return res.status(400).json({ error: { message: 'Invalid page value' } });
    }

    // Split and validate the types
    types = types.split(',');
    if (!spotifyService.validateTypes(types)) {
      return res.status(400).json({ error: { message: 'Invalid type inserted' } });
    }

    // Perform search using the Spotify service
    const { code, content } = await spotifyService.search(query, types, limit, page);

    // Send the search results
    return res.status(code).json(content);
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ error: { message: "It's not you, it's us" } });
  }
};

/**
 * Retrieves a specific Spotify element based on its type and ID.
 * @param {Object} req - The request object containing type and id.
 * @param {Object} res - The response object to send the result.
 */
module.exports.showSpotifyElement = async (req, res) => {
  try {
    const type = req.params.type;
    const id = req.params.id;

    // Check if type and id are provided
    if (!type) {
      return res.status(400).json({ error: { message: 'Type is required' } });
    }

    if (!id) {
      return res.status(400).json({ error: { message: 'Id is required' } });
    }

    // Fetch the element details using the Spotify service
    const { code, content } = await spotifyService.getElement(id, type);

    // Send the element details
    return res.status(code).json(content);
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ error: { message: "It's not you, it's us" } });
  }
};

/**
 * Retrieves a list of music genres from the Spotify service.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object to send the search results.
 * 
 * @returns {void} - This function does not return a value; it sends an HTTP response.
 *
 * @throws {Error} - If there is an issue retrieving the genres, a 500 status code is returned 
 *                   along with a message indicating an internal server error.
 */
module.exports.genres = async (req, res) => {
  try {
    // Fetch the genres from the Spotify service
    const genres = spotifyService.genres;
    res.status(200).json( genres );
  } catch (error) {
    console.error(error);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

/**
 * Handles search requests for users and playlists based on a query string.
 * Supports filtering by tags and song IDs, with results paginated.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object to send the search results.
  * @param {string} req.params.query - The search query string.
  * @param {string} [req.query.tags] - A comma-separated list of tags to filter playlists.
  * @param {string} [req.query.songIds] - A comma-separated list of song IDs to filter playlists.
  * @param {string} [req.query.types] - A comma-separated list specifying the types of items to search for ('user', 'playlist').
  * @param {number} [req.query.page=0] - The page number for pagination (zero-based index).
  * @param {number} [req.query.limit=10] - The number of items to return per page.
 * @returns {void} Sends a JSON response with the search results, including pagination data for users and/or playlists.
 * @throws {Error} - If there is an issue retrieving the genres, a 500 status code is returned 
 *                   along with a message indicating an internal server error.
 */
module.exports.search = async (req, res) => {
  try {
    const userId = req.userId; // The ID of the user making the request.
    const query = req.params.query || ''; // The search query string, defaulting to an empty string if not provided.

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 0; // Current page number, defaulting to 0 if not provided.
    const limit = parseInt(req.query.limit, 10) || 10; // Number of results per page, defaulting to 10 if not provided.
    const skip = page * limit; // Number of results to skip based on the page number.

    // Validate tags and songIds from the query parameters
    let tags = req.query.tags ? req.query.tags.split(',') : []; // Split the tags string into an array.
    let songIds = req.query.songIds ? req.query.songIds.split(',') : []; // Split the song IDs string into an array.

    // Check if the provided tags are valid according to predefined rules.
    if (!playlistValidation.tags.isValid(tags)) {
      return res.status(400).json({ error: { message: playlistValidation.tags.description } });
    }

    // Check if the provided song IDs are valid according to predefined rules.
    if (!playlistValidation.songs.isValid(songIds)) {
      return res.status(400).json({ error: { message: playlistValidation.songs.description } });
    }

    // Extract and validate types from the query string
    const types = req.query.types ? req.query.types.split(',') : ['user', 'playlist']; // Defaults to both 'user' and 'playlist' if not provided.

    // Validate the 'types' parameter to ensure it only contains 'user' and/or 'playlist'.
    const validTypes = ['user', 'playlist'];
    const invalidTypes = types.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      return res.status(400).json({ error: { message: `Invalid type(s) in query: ${invalidTypes.join(', ')}` } });
    }

    // Initialize variables for storing results and pagination data
    let users = [];
    let playlists = [];
    let totalUsers = 0;
    let totalPlaylists = 0;
    let totalUserPages = 0;
    let totalPlaylistPages = 0;

    // Search for users if 'user' is in the types array
    if (types.includes('user')) {
      const userQuery = [
        {
          $match: {
            $or: [
              { username: { $regex: query, $options: 'i' } }, // Matches username against the query string, case-insensitive.
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ['$firstName', ' ', '$lastName'] }, // Concatenate firstName and lastName for full name search.
                    regex: query,
                    options: 'i'
                  }
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            fullName: { $concat: ['$firstName', ' ', '$lastName'] } // Project full name as a concatenated field.
          }
        }
      ];

      // Execute the user query with pagination
      users = await User.aggregate(userQuery)
        .skip(skip)
        .limit(limit);

      // Count total users matching the query to calculate pagination
      totalUsers = await User.aggregate([
        { $match: userQuery[0].$match }, // Reuse the match stage from the previous query
        { $count: "totalUsers" } // Count the number of matching documents
      ]);
      totalUserPages = Math.ceil((totalUsers[0]?.totalUsers || 0) / limit); // Calculate the total number of pages
    }

    // Search for playlists if 'playlist' is in the types array
    if (types.includes('playlist')) {
      const playlistQuery = {
        title: { $regex: query, $options: 'i' }, // Matches playlist title against the query string, case-insensitive.
        public: true, // Only search for public playlists.
        ...(tags.length > 0 && { tags: { $all: tags } }), // Filter playlists by tags if provided.
        ...(songIds.length > 0 && { songs: { $in: songIds } }) // Filter playlists by song IDs if provided.
      };

      // Execute the playlist query with pagination
      playlists = await Playlist.find(playlistQuery)
        .skip(skip)
        .limit(limit);

      // Count total playlists matching the query to calculate pagination
      totalPlaylists = await Playlist.countDocuments(playlistQuery);
      totalPlaylistPages = Math.ceil(totalPlaylists / limit); // Calculate the total number of pages
    }

    // If no results are found, return a 404 status with an error message
    if (users.length === 0 && playlists.length === 0) {
      return res.status(404).json({ error: { message: 'No items found' } });
    }

    // Send the search results along with pagination data
    return res.status(200).json({
      users: users,
      playlists: playlists,
      pagination: {
        users: {
          totalResults: totalUsers[0]?.totalUsers || 0,
          totalPages: totalUserPages,
          currentPage: page,
          resultsPerPage: limit
        },
        playlists: {
          totalResults: totalPlaylists,
          totalPages: totalPlaylistPages,
          currentPage: page,
          resultsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error(error);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};
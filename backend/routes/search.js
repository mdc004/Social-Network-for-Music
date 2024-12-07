const express = require('express');
const searchController = require('../controllers/search');
const verifyToken = require('../middlewares/authentication');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Endpoints for searching and retrieving various Spotify elements and user-related data. 
 *       Includes operations to search for elements like albums, artists, and playlists, as well as manage user-related functionalities such as managing favorite genres, playlists, and artists.
 */

/**
 * @swagger
 * /spotify/genres/:
 *   get:
 *     tags: 
 *       - Search
 *     summary: Retrieve a list of available genres from Spotify.
 *     description: |
 *       This endpoint allows clients to retrieve a list of all available music genres from Spotify's service. 
 *       These genres can be used for searching, filtering playlists, or categorizing music preferences.
 *     responses:
 *       200:
 *         description: A list of music genres successfully retrieved from Spotify.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 genres:
 *                   type: array
 *                   description: An array of available music genres.
 *                   items:
 *                     type: string
 *                     example: "pop"
 *                   example:
 *                     - "acoustic"
 *                     - "afrobeat"
 *                     - "alt-rock"
 *                     - "alternative"
 *                     - "ambient"
 *                     - "anime"
 *                     - "black-metal"
 *                     - "bluegrass"
 *                     - "blues"
 *                     - "bossanova"
 *                     - "brazil"
 *                     - "breakbeat"
 *                     - "british"
 *                     - "cantopop"
 *                     - "chicago-house"
 *                     - "children"
 *                     - "chill"
 *                     - "classical"
 *                     - "club"
 *                     - "comedy"
 *                     - "country"
 *                     - "dance"
 *                     - "dancehall"
 *                     - "death-metal"
 *                     - "deep-house"
 *                     - "detroit-techno"
 *                     - "disco"
 *                     - "disney"
 *                     - "drum-and-bass"
 *                     - "dub"
 *                     - "dubstep"
 *                     - "edm"
 *                     - "electro"
 *                     - "electronic"
 *                     - "emo"
 *                     - "folk"
 *                     - "forro"
 *                     - "french"
 *                     - "funk"
 *                     - "garage"
 *                     - "german"
 *                     - "gospel"
 *                     - "goth"
 *                     - "grindcore"
 *                     - "groove"
 *                     - "grunge"
 *                     - "guitar"
 *                     - "happy"
 *                     - "hard-rock"
 *                     - "hardcore"
 *                     - "hardstyle"
 *                     - "heavy-metal"
 *                     - "hip-hop"
 *                     - "holidays"
 *                     - "honky-tonk"
 *                     - "house"
 *                     - "idm"
 *                     - "indian"
 *                     - "indie"
 *                     - "indie-pop"
 *                     - "industrial"
 *                     - "iranian"
 *                     - "j-dance"
 *                     - "j-idol"
 *                     - "j-pop"
 *                     - "j-rock"
 *                     - "jazz"
 *                     - "k-pop"
 *                     - "kids"
 *                     - "latin"
 *                     - "latino"
 *                     - "malay"
 *                     - "mandopop"
 *                     - "metal"
 *                     - "metal-misc"
 *                     - "metalcore"
 *                     - "minimal-techno"
 *                     - "movies"
 *                     - "mpb"
 *                     - "new-age"
 *                     - "new-release"
 *                     - "opera"
 *                     - "pagode"
 *                     - "party"
 *                     - "philippines-opm"
 *                     - "piano"
 *                     - "pop"
 *                     - "pop-film"
 *                     - "post-dubstep"
 *                     - "power-pop"
 *                     - "progressive-house"
 *                     - "psych-rock"
 *                     - "punk"
 *                     - "punk-rock"
 *                     - "r-n-b"
 *                     - "rainy-day"
 *                     - "reggae"
 *                     - "reggaeton"
 *                     - "road-trip"
 *                     - "rock"
 *                     - "rock-n-roll"
 *                     - "rockabilly"
 *                     - "romance"
 *                     - "sad"
 *                     - "salsa"
 *                     - "samba"
 *                     - "sertanejo"
 *                     - "show-tunes"
 *                     - "singer-songwriter"
 *                     - "ska"
 *                     - "sleep"
 *                     - "songwriter"
 *                     - "soul"
 *                     - "soundtracks"
 *                     - "spanish"
 *                     - "study"
 *                     - "summer"
 *                     - "swedish"
 *                     - "synth-pop"
 *                     - "tango"
 *                     - "techno"
 *                     - "trance"
 *                     - "trip-hop"
 *                     - "turkish"
 *                     - "work-out"
 *                     - "world-music"
 *       500:
 *         description: Internal server error occurred while retrieving the genres.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "It's not you, it's us"
 */
router.get('/spotify/genres/', verifyToken, searchController.genres);

/**
 * @swagger
 * /spotify/{query}:
 *   get:
 *     tags: [Search]
 *     description: Search for Spotify elements based on a query.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: The search query string.
 *         schema:
 *           type: string
 *       - name: types
 *         in: query
 *         required: true
 *         description: Comma-separated list of element types to search for (e.g., album, artist).
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination (zero-based). Default is 0.
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Successful search result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define the properties of the response here
 *       400:
 *         description: Bad request, missing or invalid query or parameters.
 *       500:
 *         description: Internal server error.
 */
router.get('/spotify/:query', verifyToken, searchController.searchSpotifyElement);

/**
 * @swagger
 * /spotify/{type}/{id}:
 *   get:
 *     tags: [Search]
 *     description: Retrieve a specific Spotify element by type and ID.
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         description: The type of Spotify element (e.g., album, artist).
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the Spotify element.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of the Spotify element.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define the properties of the response here
 *       400:
 *         description: Bad request, missing or invalid type or ID.
 *       500:
 *         description: Internal server error.
 */
router.get('/spotify/:type/:id', verifyToken, searchController.showSpotifyElement);

/**
 * @swagger
 * /{query}:
 *   get:
 *     tags: 
 *       - Search
 *     summary: Search for users and playlists based on a query string.
 *     description: |
 *       This endpoint allows searching for users and playlists using a query string. The search can be filtered 
 *       by tags and song IDs, and results are paginated. You can specify the types of items to search for 
 *       (either 'user', 'playlist', or both). The endpoint returns the search results along with pagination data 
 *       for each type of item.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: The search query string used to match users or playlists.
 *         schema:
 *           type: string
 *       - name: tags
 *         in: query
 *         description: |
 *           A comma-separated list of tags to filter playlists. 
 *           Only playlists that contain all specified tags will be returned.
 *         schema:
 *           type: string
 *           example: rock,pop,indie
 *       - name: songIds
 *         in: query
 *         description: |
 *           A comma-separated list of song IDs to filter playlists.
 *           Only playlists that contain at least one of the specified song IDs will be returned.
 *         schema:
 *           type: string
 *           example: 1a2b3c,4d5e6f,7g8h9i
 *       - name: types
 *         in: query
 *         description: |
 *           A comma-separated list specifying the types of items to search for. 
 *           Valid values are 'user' and 'playlist'. If omitted, the search includes both types by default.
 *         schema:
 *           type: string
 *           example: user,playlist
 *       - name: page
 *         in: query
 *         description: |
 *           The page number for pagination (zero-based index). 
 *           Defaults to 0 if not provided.
 *         schema:
 *           type: integer
 *           example: 0
 *       - name: limit
 *         in: query
 *         description: |
 *           The number of results to return per page.
 *           Defaults to 10 if not provided.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successful search result with users and playlists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: List of users that match the search query.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the user.
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                         example: "example@example.com"
 *                       username:
 *                         type: string
 *                         description: The username of the user.
 *                         example: "john_doe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the user account was created.
 *                         example: "2024-08-10T14:48:00.000Z"
 *                       firstName:
 *                         type: string
 *                         description: The first name of the user.
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         description: The last name of the user.
 *                         example: "Doe"
 *                       info:
 *                         type: string
 *                         description: Additional information about the user.
 *                         example: "I love music!"
 *                       preferences:
 *                         type: object
 *                         description: The user's preferences.
 *                         properties:
 *                           artists:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: List of favorite artist IDs.
 *                             example: ["1a2b3c4d", "5e6f7g8h"]
 *                           following:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: List of IDs of users that this user is following.
 *                             example: ["60d21b4667d0d8992e610c85"]
 *                           genres:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: List of preferred genres.
 *                             example: ["rock", "pop", "indie"]
 *                           playlists:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: List of playlist IDs created by the user.
 *                             example: ["60d21b4667d0d8992e610c85"]
 *                 playlists:
 *                   type: array
 *                   description: List of playlists that match the search query.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the playlist.
 *                       title:
 *                         type: string
 *                         description: The title of the playlist.
 *                         example: "My Playlist"
 *                       description:
 *                         type: string
 *                         description: A brief description of the playlist.
 *                         example: "A playlist for relaxing and unwinding."
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: List of tags associated with the playlist.
 *                         example: ["chill", "relaxing", "instrumental"]
 *                       songs:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: List of Spotify track IDs in the playlist.
 *                         example: ["3n3Ppam7vgaVa1iaRUc9Lp", "1a2b3c4d5e"]
 *                       owner:
 *                         type: string
 *                         description: The user ID of the playlist's owner.
 *                         example: "60d21b4667d0d8992e610c85"
 *                       public:
 *                         type: boolean
 *                         description: Indicates whether the playlist is public or private.
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the playlist was created.
 *                         example: "2024-08-10T14:48:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the playlist was last updated.
 *                         example: "2024-08-10T14:48:00.000Z"
 *                 pagination:
 *                   type: object
 *                   description: Pagination data for the search results.
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         totalResults:
 *                           type: integer
 *                           description: The total number of users that match the search query.
 *                         totalPages:
 *                           type: integer
 *                           description: The total number of pages for the user search results.
 *                         currentPage:
 *                           type: integer
 *                           description: The current page of the user search results.
 *                         resultsPerPage:
 *                           type: integer
 *                           description: The number of users returned per page.
 *                     playlists:
 *                       type: object
 *                       properties:
 *                         totalResults:
 *                           type: integer
 *                           description: The total number of playlists that match the search query.
 *                         totalPages:
 *                           type: integer
 *                           description: The total number of pages for the playlist search results.
 *                         currentPage:
 *                           type: integer
 *                           description: The current page of the playlist search results.
 *                         resultsPerPage:
 *                           type: integer
 *                           description: The number of playlists returned per page.
 *       400:
 *         description: Bad request. This may occur if invalid query parameters are provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid type(s) in query: invalidType"
 *       404:
 *         description: No items found. The query did not match any users or playlists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "No items found"
 *       500:
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "It's not you, it's us"
 */
router.get('/:query', verifyToken, searchController.search);

module.exports = router;
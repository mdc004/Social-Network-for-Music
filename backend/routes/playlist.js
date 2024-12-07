/**
 * @swagger
 * tags:
 *   - name: Playlist
 *     description: Operations related to playlist management, including creating, updating, and deleting playlists, as well as managing songs, tags, and avatars.
 */

const express = require('express');

const playlistController = require('../controllers/playlist');
const verifyToken = require('../middlewares/authentication');
const validator = require('../middlewares/validator');
const checkExistence = require('../middlewares/checkExistence');
const upload = require('../middlewares/upload');

const router = express.Router();

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     tags:
 *       - Playlist
 *     summary: Retrieve a specific playlist by ID.
 *     description: Fetch details of a playlist using its ID. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful retrieval of the playlist.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:playlistId', verifyToken, validator, checkExistence.playlist, playlistController.show);

/**
 * @swagger
 * /playlists:
 *   post:
 *     tags:
 *       - Playlist
 *     summary: Create a new playlist.
 *     description: Create a new playlist. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the playlist.
 *               description:
 *                 type: string
 *                 description: A description of the playlist.
 *     responses:
 *       '201':
 *         description: Playlist created successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '400':
 *         description: Bad request, validation errors.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', verifyToken, validator, playlistController.create);

/**
 * @swagger
 * /playlists/{playlistId}/visibility:
 *   patch:
 *     tags:
 *       - Playlist
 *     summary: Change the visibility of a playlist.
 *     description: Update the visibility status of a playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist whose visibility is to be changed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visibility:
 *                 type: string
 *                 description: New visibility status (e.g., public, private).
 *     responses:
 *       '204':
 *         description: Visibility updated successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.patch('/:playlistId/visibility/', verifyToken, validator, checkExistence.playlist, playlistController.changeVisibility);

/**
 * @swagger
 * /playlists/{playlistId}/info:
 *   patch:
 *     tags:
 *       - Playlist
 *     summary: Update playlist information.
 *     description: Update information such as name or description of a playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the playlist.
 *               description:
 *                 type: string
 *                 description: Updated description of the playlist.
 *     responses:
 *       '204':
 *         description: Playlist information updated successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.patch('/:playlistId/info', verifyToken, validator, checkExistence.playlist, playlistController.updateInfo);

/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     tags:
 *       - Playlist
 *     summary: Delete a specific playlist.
 *     description: Delete a playlist using its ID. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Playlist deleted successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:playlistId', verifyToken, validator, checkExistence.playlist, playlistController.delete);

/**
 * @swagger
 * /playlists/{playlistId}/songs/{songId}:
 *   post:
 *     tags:
 *       - Playlist
 *     summary: Add a song to a playlist.
 *     description: Add a song to the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to which the song will be added.
 *         schema:
 *           type: string
 *       - name: songId
 *         in: path
 *         required: true
 *         description: The ID of the song to add.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Song added successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist or song not found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/:playlistId/songs/:songId', verifyToken, validator, checkExistence.playlist, playlistController.addSong);

/**
 * @swagger
 * /playlists/{playlistId}/songs/{songId}:
 *   delete:
 *     tags:
 *       - Playlist
 *     summary: Remove a song from a playlist.
 *     description: Remove a song from the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist from which the song will be removed.
 *         schema:
 *           type: string
 *       - name: songId
 *         in: path
 *         required: true
 *         description: The ID of the song to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Song removed successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist or song not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:playlistId/songs/:songId', verifyToken, checkExistence.playlist, playlistController.removeSong);

/**
 * @swagger
 * /playlists/{playlistId}/tags/{tag}:
 *   post:
 *     tags:
 *       - Playlist
 *     summary: Add a tag to a playlist.
 *     description: Add a tag to the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist to which the tag will be added.
 *         schema:
 *           type: string
 *       - name: tag
 *         in: path
 *         required: true
 *         description: The tag to add.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Tag added successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/:playlistId/tags/:tag', verifyToken, validator, checkExistence.playlist, playlistController.addTag);

/**
 * @swagger
 * /playlists/{playlistId}/tags/{tag}:
 *   delete:
 *     tags:
 *       - Playlist
 *     summary: Remove a tag from a playlist.
 *     description: Remove a tag from the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist from which the tag will be removed.
 *         schema:
 *           type: string
 *       - name: tag
 *         in: path
 *         required: true
 *         description: The tag to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Tag removed successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:playlistId/tags/:tag', verifyToken, checkExistence.playlist, playlistController.removeTag);

/**
 * @swagger
 * /playlists/{playlistId}/avatar:
 *   post:
 *     tags:
 *       - Playlist
 *     summary: Upload a new avatar for a playlist.
 *     description: Upload an avatar image for the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist for which the avatar will be uploaded.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload.
 *     responses:
 *       '204':
 *         description: Avatar uploaded successfully.
 *       '400':
 *         description: No file uploaded or invalid file.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/:playlistId/avatar/', verifyToken, validator, checkExistence.playlist, upload.playlistAvatar.single('avatar'), upload.multerErrorHandler, playlistController.addAvatar);

/**
 * @swagger
 * /playlists/{playlistId}/avatar:
 *   delete:
 *     tags:
 *       - Playlist
 *     summary: Remove the avatar from a playlist.
 *     description: Remove the avatar image from the specified playlist. Requires authentication.
 *     parameters:
 *       - name: playlistId
 *         in: path
 *         required: true
 *         description: The ID of the playlist from which the avatar will be removed.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Avatar removed successfully.
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *       '404':
 *         description: Playlist not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:playlistId/avatar/', verifyToken, validator, checkExistence.playlist, playlistController.removeAvatar);

module.exports = router;

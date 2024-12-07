const express = require('express');
const userController = require('../controllers/user');
const verifyToken = require('../middlewares/authentication');
const validator = require('../middlewares/validator');
const checkExistence = require('../middlewares/checkExistence');
const upload = require('../middlewares/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     description: Retrieve a specific user by ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID.
 *                 username:
 *                   type: string
 *                   description: Username of the user.
 *                 firstName:
 *                   type: string
 *                   description: First name of the user.
 *                 lastName:
 *                   type: string
 *                   description: Last name of the user.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: User creation date.
 *                 personalInfo:
 *                   type: object
 *                   description: Personal information of the user.
 *                 preferences:
 *                   type: object
 *                   description: User's preferences.
 *       500:
 *         description: Server error.
 */
router.get('/:userId', verifyToken, validator, checkExistence.user, userController.show);

/**
 * @swagger
 * /users/{userId}/playlists:
 *   get:
 *     tags: [Users]
 *     description: Retrieve a user's playlists.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose playlists are to be retrieved.
 *     responses:
 *       200:
 *         description: List of playlists found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Playlist ID.
 *                   name:
 *                     type: string
 *                     description: Playlist name.
 *                   isPublic:
 *                     type: boolean
 *                     description: Whether the playlist is public.
 *       404:
 *         description: No playlists found.
 *       500:
 *         description: Server error.
 */
router.get('/:userId/playlists', verifyToken, validator, checkExistence.user, userController.showPlaylists);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     description: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address.
 *               username:
 *                 type: string
 *                 description: Username.
 *               password:
 *                 type: string
 *                 description: User password.
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *               info:
 *                 type: string
 *                 description: Additional user information.
 *               playlists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User playlists.
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Favorite genres.
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Favorite artists.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: ID of the newly created user.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: Username or email already exists.
 *       500:
 *         description: Server error.
 */
router.post('/', validator, userController.create);

/**
 * @swagger
 * /users/password:
 *   patch:
 *     tags: [Users]
 *     description: Update user's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password.
 *               newPassword:
 *                 type: string
 *                 description: New password.
 *     responses:
 *       204:
 *         description: Password updated successfully.
 *       400:
 *         description: Bad request (missing old or new password).
 *       500:
 *         description: Server error.
 */
router.patch('/password', verifyToken, validator, userController.updatePassword);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     tags: [Users]
 *     description: Update user's profile information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: New first name.
 *               lastName:
 *                 type: string
 *                 description: New last name.
 *               info:
 *                 type: string
 *                 description: New personal information.
 *     responses:
 *       204:
 *         description: Profile updated successfully.
 *       400:
 *         description: Bad request (missing required fields).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.patch('/profile', verifyToken, validator, userController.updateProfile);

/**
 * @swagger
 * /users/genre/{genreId}:
 *   post:
 *     tags: [Users]
 *     description: Add a genre to the user's favorites.
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genre to add.
 *     responses:
 *       204:
 *         description: Genre added successfully.
 *       400:
 *         description: Genre already in favorites.
 *       500:
 *         description: Server error.
 */
router.post('/genre/:genreId', verifyToken, validator, userController.addGenre);

/**
 * @swagger
 * /users/genre/{genreId}:
 *   delete:
 *     tags: [Users]
 *     description: Remove a genre from the user's favorites.
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genre to remove.
 *     responses:
 *       204:
 *         description: Genre removed successfully.
 *       404:
 *         description: Genre not found in favorites.
 *       500:
 *         description: Server error.
 */
router.delete('/genre/:genreId', verifyToken, validator, userController.removeGenre);

/**
 * @swagger
 * /users/playlist/{playlistId}:
 *   post:
 *     tags: [Users]
 *     description: Add a playlist to the user's favorites.
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to add.
 *     responses:
 *       204:
 *         description: Playlist added successfully.
 *       400:
 *         description: Playlist already in favorites.
 *       500:
 *         description: Server error.
 */
router.post('/playlist/:playlistId', verifyToken, validator, checkExistence.playlist, userController.addPlaylist);

/**
 * @swagger
 * /users/playlist/{playlistId}:
 *   delete:
 *     tags: [Users]
 *     description: Remove a playlist from the user's favorites.
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to remove.
 *     responses:
 *       204:
 *         description: Playlist removed successfully.
 *       404:
 *         description: Playlist not found in favorites.
 *       500:
 *         description: Server error.
 */
router.delete('/playlist/:playlistId', verifyToken, validator, userController.removePlaylist);

/**
 * @swagger
 * /users/artist/{artistId}:
 *   post:
 *     tags: [Users]
 *     description: Add an artist to the user's favorites.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artist to add.
 *     responses:
 *       204:
 *         description: Artist added successfully.
 *       400:
 *         description: Artist already in favorites.
 *       500:
 *         description: Server error.
 */
router.post('/artist/:artistId', verifyToken, validator, userController.addArtist);

/**
 * @swagger
 * /users/artist/{artistId}:
 *   delete:
 *     tags: [Users]
 *     description: Remove an artist from the user's favorites.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artist to remove.
 *     responses:
 *       204:
 *         description: Artist removed successfully.
 *       404:
 *         description: Artist not found in favorites.
 *       500:
 *         description: Server error.
 */
router.delete('/artist/:artistId', verifyToken, userController.removeArtist);

/**
 * @swagger
 * /users/following/{userId}:
 *   post:
 *     tags: [Users]
 *     description: Add a user to the following list of the currently authenticated user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow.
 *     responses:
 *       204:
 *         description: User successfully added to following list.
 *       400:
 *         description: Invalid user ID or user is already being followed.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: User to follow not found.
 *       500:
 *         description: Server error.
 */
router.post('/following/:userId', verifyToken, validator, checkExistence.user, userController.addUser);

/**
 * @swagger
 * /users/following/{userId}:
 *   delete:
 *     tags: [Users]
 *     description: Remove a user from the following list of the currently authenticated user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow.
 *     responses:
 *       204:
 *         description: User successfully removed from following list.
 *       400:
 *         description: Invalid user ID or user is not in the following list.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: User to unfollow not found.
 *       500:
 *         description: Server error.
 */
router.delete('/following/:userId', verifyToken, validator, userController.removeUser);

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     tags: [Users]
 *     description: Upload a new avatar for the user.
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
 *                 description: Avatar image file.
 *     responses:
 *       204:
 *         description: Avatar uploaded successfully.
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: Server error.
 */
router.post('/avatar', verifyToken, upload.userAvatar.single('avatar'), upload.multerErrorHandler, userController.addAvatar);

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     tags: [Users]
 *     description: Remove the user's avatar.
 *     responses:
 *       204:
 *         description: Avatar removed successfully.
 *       500:
 *         description: Server error.
 */
router.delete('/avatar', verifyToken, userController.removeAvatar);

/**
 * @swagger
 * /users:
 *   delete:
 *     tags: [Users]
 *     description: Delete the user's account and associated data.
 *     responses:
 *       204:
 *         description: User account and data deleted successfully.
 *       500:
 *         description: Server error.
 */
router.delete('/', verifyToken, userController.delete);

module.exports = router;
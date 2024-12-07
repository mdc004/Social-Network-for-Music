/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user authentication, including login.
 */

const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate a user and return a token for further requests. Requires valid credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successfully logged in. Returns a token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token for the user.
 *                 userId:
 *                   type: string
 *                   description: Authenticated user id.
 *       '400':
 *         description: Bad request. Invalid username or password.
 *       '401':
 *         description: Unauthorized. Credentials are missing or invalid.
 *       '500':
 *         description: Internal server error.
 */
router.post('/login', authController.login);

module.exports = router;
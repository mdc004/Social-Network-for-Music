const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./../models/user');

/**
 * Middleware to verify JWT token and attach user information to the request.
 * 
 * This middleware function checks for the presence of a JWT token in the 
 * Authorization header, verifies the token, and then decodes it. It also 
 * checks if the user associated with the token exists in the database. If 
 * everything is valid, it attaches the user ID and user information to the 
 * request object and calls the next middleware function.
 * 
 * @async
 * @function verifyToken
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the next middleware 
 * function is called or an error response is sent.
 * @throws {Error} Throws an error if there is an issue processing the token 
 * or querying the database.
 */
const verifyToken = async (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];
    // Get the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1];

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ error: { message: 'No Token inserted' } });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // Handle token verification errors
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: { message: 'Token has expired' } });
        }
        return res.status(401).json({ error: { message: 'Invalid Token' } });
      }

      // Check if the user ID in the token is a valid MongoDB ObjectId
      if (!mongoose.isValidObjectId(decoded.userId)) {
        return res.status(500).json({ error: { message: "It's not you, it's us" } });
      }

      // Check if the user exists in the database
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found' } });
      }

      // Attach user ID and user object to the request
      req.userId = decoded.userId;
      req.userLogged = user;

      // Call the next middleware function
      next();
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error.message);
    console.log('*************************************');
    return res.status(500).json({ message: "It's not you, it's us" });
  }
};

module.exports = verifyToken;
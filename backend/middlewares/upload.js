const multer = require('multer');
const path = require('path');

// Multer configuration to store files in the uploads/avatars/users directory
const storageUser = multer.diskStorage({
  /**
   * Destination function to specify the upload directory for user avatars.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function to specify the destination directory.
   */
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'avatars', 'users'));
  },

  /**
   * Filename function to specify the name of the uploaded file.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function to specify the filename.
   */
  filename: (req, file, cb) => {
    const userId = req.userId; // Use the user ID for the filename
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${userId}${ext}`); // Name the file as userId.extension
  }
});

// Multer configuration to store files in the uploads/avatars/playlists directory
const storagePlaylist = multer.diskStorage({
  /**
   * Destination function to specify the upload directory for playlist avatars.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function to specify the destination directory.
   */
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'avatars', 'playlists'));
  },

  /**
   * Filename function to specify the name of the uploaded file.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function to specify the filename.
   */
  filename: (req, file, cb) => {
    const userId = req.userId; // Use the user ID for the filename
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${userId}${ext}`); // Name the file as userId.extension
  }
});

/**
 * File filter function to validate file types.
 * @param {Object} req - The request object.
 * @param {Object} file - The file object.
 * @param {Function} cb - The callback function to indicate whether the file should be accepted.
 */
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    // If file type is valid, accept the file
    return cb(null, true);
  } else {
    // If file type is invalid, reject the file
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
  }
};

// Middleware configuration for user avatars with a file size limit of 5 MB
const user = multer({
  storage: storageUser,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // File size limit (5 MB)
});

// Middleware configuration for playlist avatars with a file size limit of 5 MB
const playlist = multer({
  storage: storagePlaylist,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // File size limit (5 MB)
});

/**
 * Error handler middleware for Multer errors.
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).json({ error: { message: err.message } });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({ error: { message: 'Invalid file upload' } });
  }
  next();
}

// Export the multer configurations and error handler
module.exports.userAvatar = user;
module.exports.playlistAvatar = playlist;
module.exports.multerErrorHandler = multerErrorHandler;
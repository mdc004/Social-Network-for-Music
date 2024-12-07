require('dotenv').config();
const express = require('express');

// Requiring config
const config = require('./config/config');
const dbConnect = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Requiring routes
const authRoute = require('./routes/auth');
const playlistRoute = require('./routes/playlist');
const searchRoute = require('./routes/search');
const userRoute = require('./routes/user');

// Import the avatar middlewares
const avatarMiddleware = require('./middlewares/avatar');

const app = express();

// Middleware for JSON body parsing
app.use(express.json());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoute);
app.use('/api/playlists', playlistRoute);
app.use('/api/search', searchRoute);
app.use('/api/users', userRoute);

// Serve static files
app.use('/uploads/', express.static(config.BASE_UPLOAD_PATH));
app.use('/', express.static(config.FRONTEND_PATH));

// Routes for avatar images
app.get('/uploads/avatars/users/:filename', avatarMiddleware.users);
app.get('/uploads/avatars/playlists/:filename', avatarMiddleware.playlists);

// Initialize server
async function initializeServer() {
  try {
    await dbConnect();
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
      console.log(`*************************************`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
  }
}

console.log(`*************************************`);
initializeServer();
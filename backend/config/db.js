const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * This asynchronous function attempts to establish a connection to a MongoDB 
 * database using the connection URL composed of credentials and settings 
 * provided through environment variables. It logs a success message if the 
 * connection is successful or an error message if the connection fails.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the connection is 
 * successfully established or rejects with an error if the connection fails.
 * 
 * @throws {Error} Throws an error if the connection to MongoDB fails.
 */
const connect = async () => {
  try {
    // Construct the MongoDB connection URL using environment variables for credentials
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ucj8s6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    // Attempt to connect to MongoDB using Mongoose
    await mongoose.connect(url, { dbName: process.env.DB_NAME });

    // Log success message if connection is successful
    console.log('MongoDB Connected');
    console.log('*************************************');
  } catch (err) {
    // Log error message if connection fails
    console.error('Error connecting to MongoDB:', err.message);
    console.log('*************************************');
  }
}

// Export the connect function for use in other parts of the application
module.exports = connect;
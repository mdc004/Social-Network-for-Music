const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Description of the API'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'API server'
    }
  ]
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'URL Shortener API Docs',
        version: '1.0.0',
        description: 'API documentation for URL shortener service'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routes/*.js'] // Updated path to include src directory
  };
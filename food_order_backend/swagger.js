const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Order Hub API - Ocean Professional',
      version: '1.0.0',
      description:
        'Modern REST API for a food ordering platform. Theme: Ocean Professional (primary #2563EB, secondary #F59E0B).',
      contact: {
        name: 'Food Order Hub',
        email: 'support@foodorderhub.local',
      },
      'x-theme': {
        name: 'Ocean Professional',
        primary: '#2563EB',
        secondary: '#F59E0B',
        error: '#EF4444',
        background: '#f9fafb',
        text: '#111827',
      },
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'Authentication' },
      { name: 'Menu', description: 'Menu browsing and management' },
      { name: 'Orders', description: 'Order placement and tracking' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Use the token returned from /auth/login. In development a pseudo-JWT is used; replace with real JWT in production.',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

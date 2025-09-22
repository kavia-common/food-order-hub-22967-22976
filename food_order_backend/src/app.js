const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Ocean Professional theme for Swagger UI (custom CSS)
const swaggerCss = `
  :root {
    --op-primary: #2563EB;
    --op-secondary: #F59E0B;
    --op-error: #EF4444;
    --op-bg: #f9fafb;
    --op-text: #111827;
  }
  html, body { background: var(--op-bg); color: var(--op-text); }
  .swagger-ui .topbar { background: linear-gradient(90deg, rgba(37,99,235,0.1), rgba(243,244,246,1)); box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
  .swagger-ui .topbar .download-url-wrapper input { border-radius: 8px; }
  .swagger-ui .btn.execute { background-color: var(--op-primary) !important; border-radius: 8px; }
  .swagger-ui .opblock.opblock-post { border-color: var(--op-primary); }
  .swagger-ui .opblock.opblock-get { border-color: var(--op-secondary); }
  .swagger-ui .scheme-container { background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-radius: 10px; }
`;

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec, { customCss: swaggerCss, customfavIcon: '', customSiteTitle: 'Food Order Hub API' })(req, res, next);
});

// Expose raw OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;
  res.json({
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  });
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err.stack);
  }
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

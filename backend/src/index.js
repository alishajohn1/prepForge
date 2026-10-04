const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Fail fast on missing config instead of crashing on the first request
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  if (require.main === module) process.exit(1);
}

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Behind Render / Vercel / Koyeb proxies
app.set('trust proxy', 1);
app.disable('x-powered-by');

// CORS: FRONTEND_URL may be a comma-separated list, e.g.
// "https://prepforge.vercel.app,http://localhost:3000"
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (curl, health checks) and whitelisted origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    // Optionally allow all Vercel preview deployments of this project
    if (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));

// Health check (used by hosting platforms & uptime pingers)
app.get('/', (req, res) => res.json({ service: 'PrepForge API', status: 'OK' }));
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'PrepForge API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start a listener when run directly (node src/index.js).
// On Vercel the app is imported as a serverless handler instead.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  🚀 PrepForge API running on port ${PORT}
  📊 Environment: ${process.env.NODE_ENV || 'development'}
  🌐 CORS: ${allowedOrigins.join(', ')}
  `);
  });

  const shutdown = () => {
    server.close(() => {
      require('./db/index').pool.end().finally(() => process.exit(0));
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;

import 'dotenv/config';
import express from 'express';
import { sequelize } from './config/database';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Comma-separated list of allowed origins, e.g. "http://localhost:3001,https://app.example.com"
const configuredOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use('/', publicRoutes);
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);

// Catch-all for unknown routes so clients always get JSON, never an HTML 404 page.
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  try {
    console.log('[startup] connecting to database...');
    await sequelize.authenticate();
    console.log('[database] connection successful');

    console.log('[startup] syncing database models...');
    // For PostgreSQL/Neon, avoid `alter: true` here because enum changes can fail
    // when Sequelize tries to rewrite existing columns in place.
    await sequelize.sync();
    console.log('[database] models synchronized');

    app.listen(PORT, () => {
      console.log(`[server] ETE-TAR auth service running on http://localhost:${PORT}`);
      console.log(`[server] Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('[startup] failed to initialize server:', error);
    process.exit(1);
  }
};

void startServer();

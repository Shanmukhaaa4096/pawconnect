import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from '../server/src/config/db.js';

// Route imports
import authRoutes from '../server/src/routes/authRoutes.js';
import petRoutes from '../server/src/routes/petRoutes.js';
import applicationRoutes from '../server/src/routes/applicationRoutes.js';
import favoriteRoutes from '../server/src/routes/favoriteRoutes.js';
import messageRoutes from '../server/src/routes/messageRoutes.js';
import shelterRoutes from '../server/src/routes/shelterRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure database connection in serverless environment
let dbInitPromise = null;
const ensureDB = async () => {
  if (!dbInitPromise) {
    dbInitPromise = connectDB().catch((err) => {
      console.warn('⚠️ Serverless DB connection fallback:', err.message);
    });
  }
  return dbInitPromise;
};

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

// API Health and Status
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    app: 'PawConnect API v1.0 (Vercel Serverless)',
  });
});

app.get(['/api', '/'], (req, res) => {
  res.json({
    message: 'PawConnect API is live and healthy',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/pets',
      '/api/applications',
      '/api/favorites',
      '/api/messages',
      '/api/shelters',
    ],
  });
});

// Mount Routes on both /api/* and /* to handle any rewrite variations
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/pets', '/pets'], petRoutes);
app.use(['/api/applications', '/applications'], applicationRoutes);
app.use(['/api/favorites', '/favorites'], favoriteRoutes);
app.use(['/api/messages', '/messages'], messageRoutes);
app.use(['/api/shelters', '/shelters'], shelterRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled serverless error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred',
  });
});

export default app;

import mongoose from 'mongoose';
import { seedInitialData } from '../seed/seedData.js';

let isConnected = false;

// Sanitizes URI to hide user:password credentials from logs
const sanitizeURI = (uri) => {
  try {
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  } catch {
    return 'mongodb://[credentials-hidden]';
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawconnect';
  const isAtlas = uri.includes('mongodb+srv') || uri.includes('.mongodb.net');

  try {
    mongoose.set('strictQuery', false);

    // Setup connection event listeners
    mongoose.connection.on('connected', () => {
      isConnected = true;
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('⚠️ [MongoDB] Disconnected from database cluster');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ [MongoDB] Connection error: ${err.message}`);
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 6000 : 3000,
      autoIndex: true,
    });

    isConnected = true;
    const sanitized = sanitizeURI(uri);
    console.log(`✅ [MongoDB ${isAtlas ? 'Atlas Cloud' : 'Local'}] Connected successfully to ${sanitized}`);

    await seedInitialData();
  } catch (error) {
    isConnected = false;
    const sanitized = sanitizeURI(uri);
    console.warn(`⚠️ [MongoDB] Could not connect to MongoDB cluster at ${sanitized}: ${error.message}`);
    console.warn(`ℹ️ [PawConnect] Activating high-performance built-in in-memory store for seamless operation.`);
    await seedInitialData(true);
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? (process.env.MONGODB_URI?.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local') : 'In-Memory Store',
  readyState: mongoose.connection.readyState,
});

// Graceful shutdown
const handleGracefulShutdown = async () => {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      console.log('🛑 [MongoDB] Connection closed smoothly.');
    } catch (e) {
      // Ignore
    }
  }
};

process.on('SIGINT', handleGracefulShutdown);
process.on('SIGTERM', handleGracefulShutdown);

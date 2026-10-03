import mongoose from 'mongoose';
import { seedInitialData } from '../seed/seedData.js';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawconnect';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // fast timeout for seamless fallback if mongod isn't running
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to ${uri}`);
    await seedInitialData();
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Could not connect to MongoDB server: ${error.message}`);
    console.warn(`ℹ️ [PawConnect] Activating high-performance built-in in-memory data store for seamless immediate development!`);
    await seedInitialData(true);
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB Live' : 'In-Memory Mock Store',
});

import mongoose from 'mongoose';
import User from '../models/User';
import CommercialSpace from '../models/CommercialSpace';

// Initialize models
const models = { User, CommercialSpace };

export async function initDatabase() {
  try {
    // Check if we're already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create collections if they don't exist
    for (const [modelName, model] of Object.entries(models)) {
      try {
        await model.createCollection();
        console.log(`Collection ${modelName} initialized`);
      } catch (error) {
        console.error(`Error creating collection ${modelName}:`, error);
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
} 
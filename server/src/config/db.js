import mongoose from 'mongoose';

// Fast timeout when DB is unavailable so requests don't hang in dev
mongoose.set('bufferTimeoutMS', 2500);

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shenova';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection error: ${error.message}`);
    console.warn('[Database Notice] Ensure local MongoDB daemon is running (e.g. `brew services start mongodb-community` or Docker).');
  }
};

export default connectDB;

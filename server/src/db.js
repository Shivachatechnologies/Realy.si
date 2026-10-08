import mongoose from "mongoose";

/**
 * Connects to MongoDB when MONGODB_URI is set. The API keeps working without a
 * database: every read falls back to the shared default data.
 */
export async function connectDB(uri) {
  if (!uri) {
    console.warn("[db] MONGODB_URI not set — serving built-in demo data.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[db] connected to ${mongoose.connection.name}`);
    return true;
  } catch (err) {
    console.warn(`[db] connection failed (${err.message}) — serving built-in demo data.`);
    return false;
  }
}

export const isConnected = () => mongoose.connection.readyState === 1;

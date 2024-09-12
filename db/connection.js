import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log('Database connection successful to host:', connection.connection.host);
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
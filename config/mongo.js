import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL_NEW;

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB Atlas 🚀");
  } catch (error) {
    console.error("Error al conectar con MongoDB", error);
    throw error;
  }
};

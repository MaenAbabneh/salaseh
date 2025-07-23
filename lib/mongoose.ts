import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";
import "@/database";


interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var mongoose: Cached;
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "salaseh",
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        throw error;
      });
  }
  cached.conn = await cached.promise;

  if (cached.conn) {
    logger.debug("Using cached Mongoose instance");
  }

  return cached.conn;
};

export default dbConnect;

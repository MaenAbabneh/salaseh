import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";

interface Cached {
  Conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const MONGOSE_URI = process.env.MONGODB_URI as string;

if (!MONGOSE_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var mongoose: Cached;
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { Conn: null, promise: null };
}

const dbconnect = async (): Promise<Mongoose> => {
  if (cached.Conn) {
    logger.debug("Using cached Mongoose instance");
    return cached.Conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
       .connect(MONGOSE_URI, {
        dbName:`salaseh`,
      })
      .then((result) => {
        logger.debug("New Mongoose connection established");
        return result;
      })
        .catch((error) => {
            logger.error("Mongoose connection error:", error);
            throw error;
        });
  }
    cached.Conn = await cached.promise;
    return cached.Conn;

};

export default dbconnect;
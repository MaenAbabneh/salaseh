import { Schema, model, models, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  image?: string;
  role?: "user" | "admin";
}

export interface IUserDoc extends IUser, Document {}
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model<IUser>("User", userSchema);

export default User;

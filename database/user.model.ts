import { Schema, model, models, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  image?: string;
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

    },
  {
    timestamps: true,
  }
);

const User = models?.User || model<IUser>("User", userSchema);

export default User;

// Export all database models
export { default as User, type IUser, type IUserDoc } from "./user.model";
export {
  default as Account,
  type IAccount,
  type IAccountDoc,
} from "./account.model";

// Database connection
export { default as dbConnect } from "../lib/mongoose";

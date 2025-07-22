import { model, models, Schema, Types, Document } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);


passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = models.PasswordReset || model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default PasswordReset;
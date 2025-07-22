import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";
import PasswordReset from "@/database/passwordreset.model";
import handleError from "@/lib/handler/error";
import { ResetPasswordSchema } from "@/lib/validatoin";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = ResetPasswordSchema.parse(body);
    const { token, password } = validatedData;

    // Find and validate the reset token
    const passwordReset = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: new Date() }, // Token must not be expired
    });

    if (!passwordReset) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid or expired reset token",
          },
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find the account associated with the user and update the password
    const account = await Account.findOneAndUpdate(
      {
        userId: passwordReset.userId,
        provider: "credentials", // Only update credentials-based accounts
      },
      { password: hashedPassword },
      { new: true }
    );

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "No credentials account found for this user",
          },
        },
        { status: 404 }
      );
    }

    // Delete the used reset token
    await PasswordReset.deleteOne({ _id: passwordReset._id });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "Password reset successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api");
  }
}

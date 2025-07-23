import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";
import PasswordReset from "@/database/passwordreset.model";
import handleError from "@/lib/handler/error";
import { ResetPasswordAPISchema } from "@/lib/validatoin";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = ResetPasswordAPISchema.parse(body);
    const { password, token } = validatedData;

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

    // Find the account associated with the user first to check current password
    const account = await Account.findOne({
      userId: passwordReset.userId,
      provider: "credentials", // Only check credentials-based accounts
    });

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

    // Check if the new password is the same as the current password
    const isSamePassword = await bcrypt.compare(password, account.password);

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "New password cannot be the same as your current password. Please choose a different password.",
          },
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the password
    const updatedAccount = await Account.findOneAndUpdate(
      {
        userId: passwordReset.userId,
        provider: "credentials",
      },
      { password: hashedPassword },
      { new: true }
    );

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

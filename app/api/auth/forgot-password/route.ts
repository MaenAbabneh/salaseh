import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import PasswordReset from "@/database/passwordreset.model";
import handleError from "@/lib/handler/error";
import { forgotPasswordSchema } from "@/lib/validatoin";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "User not found with this email address",
          },
        },
        { status: 404 }
      );
    }

    // Generate secure crypto token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ userId: user._id });

    // Save reset token to PasswordReset collection
    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      expiresAt,
    });

    await passwordReset.save();

    // Log reset link to console (for development)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    console.log(`Password Reset Link for ${email}: ${resetLink}`);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "Password reset email sent successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api");
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import PasswordReset from "@/database/passwordreset.model";
import handleError from "@/lib/handler/error";
import { forgotPasswordSchema } from "@/lib/validatoin";
import { sendPasswordResetEmail } from "@/lib/mail";

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
      // Security: Don't reveal whether the email exists or not
      // Return success response to prevent email enumeration attacks
      return NextResponse.json(
        {
          success: true,
          data: {
            message:
              "If this email address exists in our system, you will receive a password reset email shortly.",
          },
        },
        { status: 200 }
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

    // Send password reset email - wrapped in separate try-catch with timeout handling
    let emailSent = false;
    try {
      // Add timeout to email sending operation (30 seconds)
      const emailPromise = sendPasswordResetEmail(email, resetToken);
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(
          () => reject(new Error("Email sending timed out after 30 seconds")),
          30000
        );
      });

      emailSent = await Promise.race([emailPromise, timeoutPromise]);
    } catch (emailError) {
      const errorMessage =
        emailError instanceof Error
          ? emailError.message
          : "Unknown email error";

      // Log additional error details for debugging
      if (emailError instanceof Error) {
        console.error("Email error stack:", emailError.stack);
      }

      // Don't block the success response since token is already created
      emailSent = false;
    }

    if (!emailSent) {
      // In development, provide more detailed error information
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          {
            success: false,
            error: {
              message:
                "Failed to send password reset email. Please check your email configuration and network connectivity.",
              details: {
                suggestion: "Check server logs for detailed error information",
                tokenCreated: true,
                resetToken: resetToken, // Only in development for debugging
              },
            },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          message:
            "If this email address exists in our system, you will receive a password reset email shortly.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Use handleError utility to return structured error response
    return handleError(error, "api");
  }
}

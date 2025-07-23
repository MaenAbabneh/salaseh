import { NextRequest, NextResponse } from "next/server";
import { testEmailConfiguration } from "@/lib/mail";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing email configuration...");

    const isValid = await testEmailConfiguration();

    if (isValid) {
      console.log("✅ Email configuration is valid!");
      return NextResponse.json({
        success: true,
        message: "Email configuration is valid",
      });
    } else {
      console.log("❌ Email configuration failed");
      return NextResponse.json(
        {
          success: false,
          message: "Email configuration failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Email test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Email configuration test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

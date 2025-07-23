/**
 * Email Configuration Test Script
 * Run this script to test your email configuration before using it in the app
 *
 * Usage: npm run test-email
 */

async function testEmailSetup() {
  console.log("🔧 Email Configuration Test");
  console.log("=".repeat(40));

  // Step 1: Check environment variables
  console.log("\n1️⃣ Checking environment variables...");

  const requiredVars = [
    "EMAIL_SERVER_HOST",
    "EMAIL_SERVER_PORT",
    "EMAIL_SERVER_USER",
    "EMAIL_SERVER_PASSWORD",
    "EMAIL_FROM",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);
  const isValid = missing.length === 0;

  if (!isValid) {
    console.log("❌ Missing email configuration:");
    missing.forEach((varName) => {
      console.log(`  - ${varName}`);
    });

    console.log("\n📋 For Gmail, add these to your .env.local:");
    console.log("EMAIL_SERVER_HOST=smtp.gmail.com");
    console.log("EMAIL_SERVER_PORT=587");
    console.log("EMAIL_SERVER_USER=your-email@gmail.com");
    console.log("EMAIL_SERVER_PASSWORD=your-app-password");
    console.log("EMAIL_FROM=your-email@gmail.com");
    return;
  }

  console.log("✅ All required environment variables are set");
  console.log("📧 Configuration:", {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    hasPassword: !!process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM,
  });

  // Step 2: Test Gmail-specific setup
  console.log("\n2️⃣ Checking Gmail configuration...");

  const isGmail =
    process.env.EMAIL_SERVER_HOST?.toLowerCase().includes("gmail");
  if (isGmail) {
    console.log("✅ Gmail SMTP detected");

    if (
      process.env.EMAIL_SERVER_PORT !== "587" &&
      process.env.EMAIL_SERVER_PORT !== "465"
    ) {
      console.log("⚠️  Recommended Gmail ports: 587 (TLS) or 465 (SSL)");
    }

    const passwordLength = process.env.EMAIL_SERVER_PASSWORD?.length || 0;
    if (
      passwordLength === 16 &&
      !/\s/.test(process.env.EMAIL_SERVER_PASSWORD || "")
    ) {
      console.log("✅ App Password format detected (16 characters)");
    } else {
      console.log("⚠️  Gmail requires App Password (16 characters, no spaces)");
      console.log(
        "   Generate one at: https://myaccount.google.com/apppasswords"
      );
    }
  }

  console.log("\n🎯 Next steps:");
  console.log("1. Make sure you have 2FA enabled on Gmail");
  console.log("2. Generate an App Password if you haven't");
  console.log("3. Test the forgot password feature in your app");
  console.log("\n✅ Configuration looks ready to test!");
}

// Run the test
testEmailSetup().catch((error) => {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
});

import nodemailer from "nodemailer";
import logger from "./logger";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

// Get email configuration from environment variables
const getEmailConfig = (): EmailConfig => {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = process.env.EMAIL_SERVER_PORT;
  const user = process.env.EMAIL_SERVER_USER;
  const password = process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !port || !user || !password || !from) {
    throw new Error(
      "Missing email configuration. Please set EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, and EMAIL_FROM environment variables."
    );
  }

  return {
    host,
    port: parseInt(port, 10),
    user,
    password,
    from,
  };
};

// Create email transporter
const createTransporter = () => {
  const config = getEmailConfig();

  // Basic transporter configuration
  const transporterConfig: any = {
    host: config.host,
    port: config.port,
    secure: config.port === 465, // Use SSL for port 465
    auth: {
      user: config.user,
      pass: config.password,
    },
    // Add timeout configurations to prevent hanging
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 15000, // 15 seconds
    // Gmail-specific configurations
    tls: {
      rejectUnauthorized: false,
    },
    debug: process.env.NODE_ENV === "development", // Enable debug logging in development
  };

  // Additional Gmail-specific settings
  const isGmail = config.host.toLowerCase().includes("gmail");
  if (isGmail) {
    transporterConfig.service = "gmail";
    // Force simple authentication for Gmail with App Password
    transporterConfig.auth = {
      user: config.user,
      pass: config.password,
    };
  }

  return nodemailer.createTransport(transporterConfig);
};

/**
 * Send password reset email to the specified email address
 * @param email - The recipient's email address
 * @param resetToken - The password reset token
 * @returns Promise<boolean> - Returns true if email was sent successfully
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  try {
    const config = getEmailConfig();
    const transporter = createTransporter();

    // Create the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    // Email template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #ddd;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #0056b3;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password for your Salaseh account. If you made this request, please click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          
          <p>Alternatively, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            ${resetLink}
          </p>
          
          <div class="warning">
            <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
          </div>
          
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <div class="footer">
            <p>Best regards,<br>The Salaseh Team</p>
            <p><small>This is an automated email. Please do not reply to this message.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textContent = `
      Reset Your Password
      
      Hello,
      
      We received a request to reset your password for your Salaseh account.
      
      To reset your password, please visit the following link:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The Salaseh Team
    `;

    // Email options
    const mailOptions = {
      from: `"Salaseh" <${config.from}>`,
      to: email,
      subject: "Reset Your Password - Salaseh",
      text: textContent,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    logger.info(`Password reset email sent successfully to ${email}`, {
      messageId: info.messageId,
      response: info.response,
    });

    return true;
  } catch (error) {
    // Enhanced error logging with more details
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      error && typeof error === "object" && "code" in error
        ? error.code
        : "UNKNOWN";

    logger.error("Failed to send password reset email", {
      email,
      error: errorMessage,
      errorCode,
      errorType: error?.constructor?.name || "Unknown",
    });

    return false;
  }
};

/**
 * Test email configuration by sending a test email
 * @returns Promise<boolean> - Returns true if test email was sent successfully
 */
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info("Email configuration is valid");
    return true;
  } catch (error) {
    logger.error("Email configuration test failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
};

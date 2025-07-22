interface SignInWithOauthParams {
  provider: "google" | "facebook";
  providerAccountId: string;
  user: {
    name: string;
    email?: string;
    image?: string;
    username: string;
  };
}

interface AuthCredentials {
  email: string;
  name: string;
  confirmPassword: string;
  password: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface ResetPasswordParams {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordParams {
  email: string;
}

interface PasswordResetToken {
  userId: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}

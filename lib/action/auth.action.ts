"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { api } from "@/lib/api";
import action from "@/lib/handler/action";
import {
  SignInSchema,
  SignUpSchema,
  forgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validatoin";
import ROUTES from "@/constants/routes";
import { ActionResponse } from "@/types/globale";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse<any>> {
  const result = await action({
    params,
    schema: SignUpSchema,
  });

  if (result instanceof Error) {
    return {
      success: false,
      error: {
        message: result.message,
        details:
          result instanceof Error && "fieldErrors" in result
            ? (result.fieldErrors as Record<string, string[]>)
            : undefined,
      },
    };
  }

  try {
    const { name, email, password } = result.params!;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userResponse = (await api.users.create({
      name,
      email,
    })) as ActionResponse<any>;

    if (!userResponse.success || !userResponse.data) {
      return {
        success: false,
        error: {
          message: userResponse.error?.message || "Failed to create user",
        },
      };
    }

    // Create credentials account
    const accountResponse = (await api.account.create({
      userId: userResponse.data._id,
      name,
      password: hashedPassword,
      provider: "credentials",
      providerAccountId: email,
    })) as ActionResponse<any>;

    if (!accountResponse.success) {
      return {
        success: false,
        error: {
          message: accountResponse.error?.message || "Failed to create account",
        },
      };
    }

    return {
      success: true,
      data: {
        user: userResponse.data,
        message: "Account created successfully",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

export async function signInWithCredentials(
  params: SignInCredentials
): Promise<ActionResponse<any>> {
  const result = await action({
    params,
    schema: SignInSchema,
  });

  if (result instanceof Error) {
    return {
      success: false,
      error: {
        message: result.message,
        details:
          result instanceof Error && "fieldErrors" in result
            ? (result.fieldErrors as Record<string, string[]>)
            : undefined,
      },
    };
  }

  try {
    const { email, password } = result.params!;

    await signIn("credentials", {
      email,
      password,
      redirectTo: ROUTES.HOME,
    });

    return {
      success: true,
      data: {
        message: "Signed in successfully",
      },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: {
          message: "Invalid credentials",
        },
      };
    }

    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

export async function forgotPassword(
  params: ForgotPasswordParams
): Promise<ActionResponse<any>> {
  const result = await action({
    params,
    schema: forgotPasswordSchema,
  });

  if (result instanceof Error) {
    return {
      success: false,
      error: {
        message: result.message,
        details:
          result instanceof Error && "fieldErrors" in result
            ? (result.fieldErrors as Record<string, string[]>)
            : undefined,
      },
    };
  }

  try {
    const { email } = result.params!;

    const response = (await api.auth.forgotPassword({
      email,
    })) as ActionResponse<any>;

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error?.message || "Failed to send reset email",
        },
      };
    }

    return {
      success: true,
      data: {
        message: "Password reset email sent successfully",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

export async function resetPassword(
  params: ResetPasswordParams
): Promise<ActionResponse<any>> {
  const result = await action({
    params,
    schema: ResetPasswordSchema,
  });

  if (result instanceof Error) {
    return {
      success: false,
      error: {
        message: result.message,
        details:
          result instanceof Error && "fieldErrors" in result
            ? (result.fieldErrors as Record<string, string[]>)
            : undefined,
      },
    };
  }

  try {
    const { token, password } = result.params!;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    const response = (await api.auth.resetPassword({
      token,
      password: hashedPassword,
    })) as ActionResponse<any>;

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error?.message || "Failed to reset password",
        },
      };
    }

    return {
      success: true,
      data: {
        message: "Password reset successfully",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

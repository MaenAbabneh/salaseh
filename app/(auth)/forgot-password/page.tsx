"use client";

import { AuthForm } from "@/components/forms/authform";
import { forgotPasswordSchema } from "@/lib/validatoin";
import { forgotPassword } from "@/lib/action/auth.action";
import { email } from "zod";

export default function ForgotPasswordPage() {
  const defaultValues = {
    email: "",
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-light850_dark100">
      <div className="w-full max-w-md p-8 space-y-6 bg-light-900 dark:bg-dark-200 rounded-lg shadow-lg border light-border-2">
        <div className="text-center space-y-2">
          <h1 className="h2-bold text-dark100_light900">Forgot Password</h1>
          <p className="paragraph-regular text-dark500_light400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <AuthForm
          schema={forgotPasswordSchema}
          defaultValues={{ email: "" }}
          onSubmit={forgotPassword}
          formType="SIGN_IN" // Using SIGN_IN to avoid showing sign up link
        />
      </div>
    </div>
  );
}

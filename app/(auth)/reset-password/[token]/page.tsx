"use client";

import { useParams, useRouter } from "next/navigation";
import { AuthForm } from "@/components/forms/authform";
import { ResetPasswordSchema } from "@/lib/validatoin";
import { resetPassword } from "@/lib/action/auth.action";
import { ActionResponse } from "@/types/globale";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";

import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const handleResetPassword = async (
    formData: any
  ): Promise<ActionResponse<any>> => {
    setServerError(null);
    // Add the token from URL params to the form data
    const dataWithToken = {
      ...formData,
      token,
    };

    const result = await resetPassword(dataWithToken);

    if (result?.success) {
      toast.success("Success", {
        description:
          "Your password has been reset successfully. You can now sign in with your new password.",
      });
      // Redirect to sign in page after successful password reset
      router.push(ROUTES.SIGNIN);
    } else {
      setServerError(result?.error?.message || "Something went wrong");
      toast.error(`Error ${result?.statusCode || ""}`, {
        description: result?.error?.message || "Something went wrong",
      });
    }

    return result;
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-light850_dark100">
      <div className="w-full max-w-md p-8 space-y-6 bg-light-900 dark:bg-dark-200 rounded-lg shadow-lg border light-border-2">
        <div className="text-center space-y-2">
          <h1 className="h2-bold text-dark100_light900">Reset Password</h1>
          <p className="paragraph-regular text-dark500_light400">
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>

        {serverError && (
          <div className="text-red-500 text-center mb-4 font-semibold">
            {serverError}
          </div>
        )}
        <AuthForm
          schema={ResetPasswordSchema}
          defaultValues={defaultValues}
          onSubmit={handleResetPassword}
          formType="RESET_PASSWORD"
          buttonText="Reset Password"
        />
      </div>
    </div>
  );
}

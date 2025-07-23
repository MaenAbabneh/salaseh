"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { JSX } from "react";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { ActionResponse } from "@/types/globale";

interface AuthFormProps {
  schema: z.ZodObject<any>;
  defaultValues: Record<string, any>;
  onSubmit: (data: any) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP" | "RESET_PASSWORD";
  buttonText?: string;
}

export function AuthForm({
  schema,
  defaultValues,
  onSubmit,
  formType,
  buttonText: customButtonText,
}: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await onSubmit(data);

    if (result?.success) {
      // Dynamic success message based on the current page
      let successMessage = "";
      let shouldRedirect = true;

      if (pathname?.includes("/forgot-password")) {
        successMessage = "Password reset link sent successfully!";
        shouldRedirect = false; // Don't redirect on forgot password
      } else if (formType === "SIGN_IN") {
        successMessage = "You have successfully signed in.";
      } else if (formType === "SIGN_UP") {
        successMessage = "You have successfully signed up.";
      } else {
        successMessage = "Operation completed successfully.";
      }

      toast.success("Success", {
        description: successMessage,
      });

      // Only redirect if it's not a forgot password page
      if (shouldRedirect) {
        router.push(ROUTES.HOME);
      }
    } else {
      toast.error(`Error ${result?.statusCode || ""}`, {
        description: result?.error?.message || "Something went wrong",
      });
    }
  };

  const getButtonText = () => {
    if (customButtonText) return customButtonText;
    if (pathname?.includes("/forgot-password")) {
      return "Send Reset Link";
    }
    if (formType === "RESET_PASSWORD") {
      return "Reset Password";
    }
    return formType === "SIGN_IN" ? "Sign In" : "Sign Up";
  };

  const getLoadingText = () => {
    if (pathname?.includes("/forgot-password")) {
      return "Sending...";
    }
    return formType === "SIGN_IN" ? "Signing In..." : "Signing Up...";
  };

  const buttonText = getButtonText();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mt-8 w-full max-w-md mx-auto"
      >
        {Object.keys(defaultValues).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as Path<FormData>}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full">
                <FormLabel className="text-dark100_light900 small-bold">
                  {fieldName === "email"
                    ? "Email Address"
                    : fieldName === "confirmPassword"
                      ? "Confirm Password"
                      : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-12 px-4 paragraph-regular text-dark300_light700 background-light700_dark300 light-border-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    type={
                      fieldName === "password" ||
                      fieldName === "confirmPassword"
                        ? "password"
                        : fieldName === "email"
                          ? "email"
                          : "text"
                    }
                    placeholder={`Enter your ${
                      fieldName === "confirmPassword"
                        ? "confirm password"
                        : fieldName
                    }...`}
                    value={String(field.value || "")}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage className="text-red-500 small-regular" />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 primary-gradient-dark dark:primary-gradient-light text-light-900 font-semibold paragraph-regular hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? getLoadingText() : buttonText}
        </Button>

        <div className="text-center mt-6">
          {formType === "SIGN_IN" ? (
            <div className="space-y-3">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="block text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200 text-sm"
              >
                Forgot your password?
              </Link>
              <p className="paragraph-regular text-dark500_light400">
                Don't have an account?{" "}
                <Link
                  href={ROUTES.SIGNUP}
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          ) : (
            <p className="paragraph-regular text-dark500_light400">
              Already have an account?{" "}
              <Link
                href={ROUTES.SIGNIN}
                className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}

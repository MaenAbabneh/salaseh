import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")

    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })

    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })

    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number letter",
    })

    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one symbol letter",
    }),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long")
   
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}); 

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});
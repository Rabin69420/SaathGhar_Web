import { z } from "zod";

// Shared login validation schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Shared registration validation schema
export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters"),
    username: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Sets the error directly on the confirmPassword field
  });

// Export TypeScript types inferred directly from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

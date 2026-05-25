"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "./schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    // Artificial delay to show submission handling states
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Verified Login Hook Data:", data);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card p-8 rounded-xl shadow-xs border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Find your next perfect space on SathGhar
        </p>
      </div>

      {/* Google Authentication Button */}
      <button
        type="button"
        onClick={() => console.log("Initiating Google OAuth...")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background text-foreground font-medium hover:bg-muted transition-all duration-200 mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.64 15.05 1 12 1 7.24 1 3.2 3.74 1.25 7.72l3.86 3a7.12 7.12 0 0 1 6.89-5.68z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.14 3.58-8.71z"
          />
          <path
            fill="#FBBC05"
            d="M5.11 14.28A7.01 7.01 0 0 1 4.75 12c0-.79.13-1.56.36-2.28L1.25 6.72A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.25 5.37l3.86-3.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.86-3a7.1 7.1 0 0 1-4.1 1.16c-3.19 0-5.89-2.15-6.85-5.05l-3.86 3A11.97 11.97 0 0 0 12 23z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border"></span>
        </div>
        <span className="relative px-3 bg-card text-xs text-muted-foreground uppercase tracking-wider">
          Or email login
        </span>
      </div>

      {/* Form Credentials Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        New to SathGhar?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

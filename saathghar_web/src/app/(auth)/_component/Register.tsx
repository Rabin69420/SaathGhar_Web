"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "./schema";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Verified Registration Hook Data:", data);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-card p-8 rounded-xl shadow-xs border border-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Join SathGhar to share rooms or book spaces
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Grid Layout Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              {...register("firstName")}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {errors.firstName && (
              <p className="text-destructive text-xs mt-1 font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {errors.lastName && (
              <p className="text-destructive text-xs mt-1 font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Username
          </label>
          <input
            type="text"
            placeholder="johndoe_99"
            {...register("username")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {errors.username && (
            <p className="text-destructive text-xs mt-1 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Security Matrix Pairs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating account..." : "Register Now"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

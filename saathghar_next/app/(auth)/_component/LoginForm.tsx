"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "./schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";    
import { handleLoginUser } from "../../../lib/actions/auth-action";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition(); 
  const [error, setError] = useState('');                
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();                             

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    setError('');
    console.log("[LoginForm] Form submitted for email:", data.email);
    
    startTransition(async () => {
      try {
        const result = await handleLoginUser(data);
        console.log("[LoginForm] handleLoginUser response:", result);
        
        if (result.success) {
          if (result.user) {
            console.log("[LoginForm] Setting user_data cookie client-side:", result.user);
            document.cookie = `user_data=${encodeURIComponent(JSON.stringify(result.user))}; path=/; max-age=2592000; samesite=lax`;
          }
          console.log("[LoginForm] Redirecting to page based on role:", result.role);
          if (result.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          console.warn("[LoginForm] Login failed. Message:", result.message);
          setError(result.message || 'Login failed');
        }
      } catch (err: any) {
        console.error("[LoginForm] Exception during login:", err);
        setError(err?.message || 'Login failed');
      }
    });
  };

  return (
    <div className="w-full bg-card/85 backdrop-blur-md px-6 py-8 sm:p-10 rounded-2xl shadow-2xl border border-border/80">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-full mb-3 shadow-xs">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome Back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Find your next perfect space on SathGhar
        </p>
      </div>

      <button
        type="button"
        onClick={() => console.log("Initiating Google OAuth...")}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:scale-[1.01] active:scale-100 transition-all duration-200 mb-6 shadow-2xs cursor-pointer"
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

      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
        </div>
        <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
          Or email login
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-2xs"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full pl-11 pr-11 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm tracking-wide uppercase hover:scale-[1.01] active:scale-100"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </div>
          ) : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        New to SathGhar?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
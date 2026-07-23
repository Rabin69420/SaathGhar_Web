"use client";

import { useEffect } from "react";
import Navbar from "@/app/component/common/Navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile page load error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 py-12 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-card border border-border shadow-lg rounded-2xl p-6 md:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              {error.message || "We encountered an issue while loading your profile."}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/95 transition-all cursor-pointer"
            >
              Try Again
            </button>
            <a
              href="/"
              className="w-full py-2.5 px-4 border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold rounded-lg transition-all text-center block"
            >
              Go to Home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

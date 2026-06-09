"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center px-6 py-4 md:px-12 bg-card border-b-2 border-primary shadow-xs">
      {/* Brand Branding Stack */}
      <div className="flex flex-col">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary hover:opacity-90"
        >
          SathGhar
        </Link>
        <span className="text-xs font-semibold text-secondary tracking-wide">
          Find Rooms & Partners
        </span>
      </div>

      {/* Intelligent Interactive Auth Group */}
      <div className="flex items-center gap-3">
        {/* Hide Login Button if the user is currently looking at the login page */}
        {pathname !== "/login" && (
          <Link
            href="/login"
            className="px-5 py-2.5 text-primary hover:text-secondary font-semibold transition-colors"
          >
            Login
          </Link>
        )}

        {/* Hide Register Button if the user is currently looking at the register page */}
        {pathname !== "/register" && (
          <Link
            href="/register"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs hover:bg-secondary hover:scale-[1.02] active:scale-100 block transition-all"
          >
            Register
          </Link>
        )}
      </div>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookieClientSide } from "@/lib/cookies-client";
import { handleLogoutUser } from "@/lib/actions/auth-action";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userDataStr = await getCookieClientSide("user_data");
      if (userDataStr) {
        try {
          setUser(JSON.parse(decodeURIComponent(userDataStr)));
        } catch {
          // ignore parsing error
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    const res = await handleLogoutUser();
    if (res.success) {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Brand Branding Stack */}
      <div className="flex flex-col">
        <Link
          href={user?.role === "admin" ? "/admin/dashboard" : "/"}
          className="text-2xl font-bold tracking-tight text-teal-600 hover:text-teal-700 transition-colors"
        >
          SathGhar
        </Link>
        <span className="text-xs font-semibold text-slate-500 tracking-wide">
          Find Rooms & Partners
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {(!user || user.role !== "admin") && (
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/" ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
            }`}
          >
            Home
          </Link>
        )}
        {user && (
          <>
            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/dashboard" ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/user/profile"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/user/profile" ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
              }`}
            >
              Profile
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className={`text-sm font-semibold transition-colors ${
                  pathname === "/admin/dashboard" ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </>
        )}
      </div>

      {/* Intelligent Interactive Auth Group */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.imageUrl ? (
                <img
                  src={
                    user.imageUrl.startsWith("http")
                      ? user.imageUrl
                      : `http://localhost:8089${user.imageUrl}`
                  }
                  alt={user.fullName || "User avatar"}
                  className="w-9 h-9 rounded-full object-cover border border-teal-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                {user.fullName || user.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-semibold border border-red-100 hover:bg-red-50 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="px-5 py-2.5 text-slate-600 hover:text-teal-600 font-semibold transition-colors text-sm"
              >
                Login
              </Link>
            )}

            {pathname !== "/register" && (
              <Link
                href="/register"
                className="px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-700 hover:scale-[1.02] active:scale-100 block transition-all text-sm"
              >
                Register
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
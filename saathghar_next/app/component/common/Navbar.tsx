"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookieClientSide } from "@/lib/cookies-client";
import { handleLogoutUser } from "@/lib/actions/auth-action";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import ConfirmModal from "./ConfirmModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userDataStr = await getCookieClientSide("user_data");
      if (userDataStr) {
        try {
          setUser(JSON.parse(decodeURIComponent(userDataStr)));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const res = await handleLogoutUser();
    if (res.success) {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  const navLinks = [
    ...(!user
      ? [{ href: "/", label: "Home", active: pathname === "/" }]
      : []),
    ...(user
      ? [
          { href: "/dashboard", label: "Home", active: pathname === "/dashboard" },
          { href: "/dashboard/applications", label: "Applications", active: pathname.startsWith("/dashboard/applications") },
          { href: "/dashboard/reviews", label: "Reviews", active: pathname.startsWith("/dashboard/reviews") },
          { href: "/dashboard/kyc", label: "KYC", active: pathname.startsWith("/dashboard/kyc") },
          { href: "/user/preferences", label: "Preferences", active: pathname === "/user/preferences" },
          { href: "/user/profile", label: "Profile", active: pathname === "/user/profile" },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 md:px-12">
        <div className="flex flex-col">
          <Link
            href={user?.role === "admin" ? "/admin/dashboard" : user ? "/dashboard" : "/"}
            className="text-2xl font-bold tracking-tight text-teal-600 hover:text-teal-700 transition-colors"
          >
            SathGhar
          </Link>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
            Find Rooms & Partners
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                link.active
                  ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2">
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
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user.fullName || user.username}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-semibold border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              {pathname !== "/login" && (
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors text-sm"
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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-2 animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
                link.active
                  ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="No"
        variant="danger"
        onConfirm={() => {
          setShowLogoutConfirm(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
  );
}

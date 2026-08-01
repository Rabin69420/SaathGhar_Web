"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { handleGetAdminStats } from "@/lib/actions/admin-action";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, totalApplications: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await handleGetAdminStats();
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: "Users", value: stats.totalUsers, color: "teal", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", href: "/admin/users" },
    { label: "Listings", value: stats.totalListings, color: "indigo", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", href: "/admin/listings" },
    { label: "Applications", value: stats.totalApplications, color: "blue", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", href: "/admin/applications" },
    { label: "Reviews", value: stats.totalReviews, color: "amber", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", href: "/admin/reviews" },
  ];

  const colorMap: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  };

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your platform.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
            >
              <div>
                <span className="block text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {card.label}
                </span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1 block">
                  {loading ? "..." : card.value}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[card.color]} group-hover:scale-110 transition-transform`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookieClientSide } from "@/lib/cookies-client";
import {
  handleGetAdminStats,
  handleGetAdminUsers,
  handleDeleteAdminUser,
  handleGetAdminListings,
  handleDeleteAdminListing
} from "@/lib/actions/admin-action";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");

  // Stats State
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0 });
  
  // Data lists
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  
  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[AdminDashboard] checkAuth triggered");
      console.log("[AdminDashboard] full document.cookie:", typeof window !== "undefined" ? document.cookie : "server-side");
      const userDataStr = await getCookieClientSide("user_data");
      console.log("[AdminDashboard] retrieved raw user_data cookie:", userDataStr);
      if (!userDataStr) {
        console.warn("[AdminDashboard] No user_data cookie, redirecting to /login");
        router.push("/login");
        return;
      }
      try {
        const parsed = JSON.parse(decodeURIComponent(userDataStr));
        console.log("[AdminDashboard] parsed user_data:", parsed);
        if (parsed.role !== "admin") {
          console.warn("[AdminDashboard] user is not admin (role: " + parsed.role + "), redirecting to /dashboard");
          router.push("/dashboard");
          return;
        }
        setCurrentUser(parsed);
        setAuthorized(true);
        console.log("[AdminDashboard] Authentication succeeded, current admin:", parsed.email);
      } catch (err) {
        console.error("[AdminDashboard] Exception in checkAuth, redirecting to /login:", err);
        router.push("/login");
      }
    };
    checkAuth();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    const res = await handleGetAdminStats();
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoadingStats(false);
  };

  const loadUsers = async () => {
    setLoadingData(true);
    const res = await handleGetAdminUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoadingData(false);
  };

  const loadListings = async () => {
    setLoadingData(true);
    const res = await handleGetAdminListings();
    if (res.success && res.data) {
      setListings(res.data);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (authorized) {
      loadStats();
      if (activeTab === "users") {
        loadUsers();
      } else {
        loadListings();
      }
    }
  }, [authorized, activeTab]);

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to delete user "${name}"? All their listings will be affected.`)) {
      const res = await handleDeleteAdminUser(id);
      if (res.success) {
        alert("User deleted successfully!");
        loadUsers();
        loadStats();
      } else {
        alert(res.message || "Failed to delete user");
      }
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete room listing "${title}"?`)) {
      const res = await handleDeleteAdminListing(id);
      if (res.success) {
        alert("Room listing deleted successfully!");
        loadListings();
        loadStats();
      } else {
        alert(res.message || "Failed to delete listing");
      }
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage system users, listings, and view platforms stats.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Registered Users
              </span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2 block">
                {loadingStats ? "..." : stats.totalUsers}
              </span>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Active Rooms
              </span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2 block">
                {loadingStats ? "..." : stats.totalListings}
              </span>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="border-b border-slate-200 mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "users"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "listings"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Rooms / Listings
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
          {loadingData ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : activeTab === "users" ? (
            users.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Avatar</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          {u.imageUrl ? (
                            <img
                              src={u.imageUrl.startsWith("http") ? u.imageUrl : `http://localhost:8089${u.imageUrl}`}
                              alt={u.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {u.fullName ? u.fullName[0].toUpperCase() : "U"}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 font-semibold">{u.fullName}</td>
                        <td className="py-4 px-6 text-slate-500">@{u.username}</td>
                        <td className="py-4 px-6 text-slate-500">{u.email}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              u.role === "admin"
                                ? "bg-teal-50 text-teal-700 border border-teal-100"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id, u.fullName)}
                            disabled={u._id === currentUser._id}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                            title="Delete User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            listings.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No rooms posted yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Preview</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Rent</th>
                      <th className="py-4 px-6">Owner</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {listings.map((l) => {
                      const imageUrl = l.image.startsWith("http")
                        ? l.image
                        : `http://localhost:8089/uploads/${l.image}`;
                      return (
                        <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <img
                              src={imageUrl}
                              alt={l.title}
                              className="w-12 h-8 rounded object-cover"
                            />
                          </td>
                          <td className="py-4 px-6 font-semibold line-clamp-1 max-w-xs">{l.title}</td>
                          <td className="py-4 px-6 text-slate-500">{l.location}</td>
                          <td className="py-4 px-6 font-bold text-teal-600">Rs. {l.rent}</td>
                          <td className="py-4 px-6 text-slate-500">
                            {l.owner?.fullName || "System Admin"}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteListing(l._id, l.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Room"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

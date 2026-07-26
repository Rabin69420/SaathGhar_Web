"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookieClientSide } from "@/lib/cookies-client";
import {
  handleGetAdminStats,
  handleGetAdminUsers,
  handleDeleteAdminUser,
  handleGetAdminListings,
  handleDeleteAdminListing,
  handleGetAdminApplications,
  handleDeleteAdminApplication,
  handleGetAdminReviews,
  handleDeleteAdminReview,
} from "@/lib/actions/admin-action";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/component/common/ConfirmModal";

type TabType = "users" | "listings" | "applications" | "reviews";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("users");

  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, totalApplications: 0, totalReviews: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string; type: TabType }>({ open: false, id: "", name: "", type: "users" });

  useEffect(() => {
    const checkAuth = async () => {
      const userDataStr = await getCookieClientSide("user_data");
      if (!userDataStr) { router.push("/login"); return; }
      try {
        const parsed = JSON.parse(decodeURIComponent(userDataStr));
        if (parsed.role !== "admin") { router.push("/dashboard"); return; }
        setCurrentUser(parsed);
        setAuthorized(true);
      } catch { router.push("/login"); }
    };
    checkAuth();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    const res = await handleGetAdminStats();
    if (res.success && res.data) setStats(res.data);
    setLoadingStats(false);
  };

  const loadTabData = async (tab: TabType) => {
    setLoadingData(true);
    if (tab === "users") {
      const res = await handleGetAdminUsers();
      if (res.success && res.data) setUsers(res.data);
    } else if (tab === "listings") {
      const res = await handleGetAdminListings();
      if (res.success && res.data) setListings(res.data);
    } else if (tab === "applications") {
      const res = await handleGetAdminApplications();
      if (res.success && res.data) setApplications(res.data);
    } else if (tab === "reviews") {
      const res = await handleGetAdminReviews();
      if (res.success && res.data) setReviews(res.data);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (authorized) {
      loadStats();
      loadTabData(activeTab);
    }
  }, [authorized, activeTab]);

  const confirmDelete = async () => {
    const { id, type } = deleteConfirm;
    let res;
    if (type === "users") res = await handleDeleteAdminUser(id);
    else if (type === "listings") res = await handleDeleteAdminListing(id);
    else if (type === "applications") res = await handleDeleteAdminApplication(id);
    else res = await handleDeleteAdminReview(id);

    if (res.success) {
      toast.success(res.message || "Deleted successfully!");
      loadTabData(activeTab);
      loadStats();
    } else {
      toast.error(res.message || "Delete failed");
    }
    setDeleteConfirm({ open: false, id: "", name: "", type: "users" });
  };

  if (!authorized) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: "users", label: "Users" },
    { key: "listings", label: "Listings" },
    { key: "applications", label: "Applications" },
    { key: "reviews", label: "Reviews" },
  ];

  const statCards = [
    { label: "Users", value: stats.totalUsers, color: "teal", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Listings", value: stats.totalListings, color: "indigo", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Applications", value: stats.totalApplications, color: "blue", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Reviews", value: stats.totalReviews, color: "amber", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  ];

  const colorMap: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Admin Control Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage users, listings, applications, and reviews.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{card.label}</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1 block">
                  {loadingStats ? "..." : card.value}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loadingData ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : activeTab === "users" ? (
            users.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Avatar</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          {u.imageUrl ? (
                            <img src={u.imageUrl.startsWith("http") ? u.imageUrl : `http://localhost:8089${u.imageUrl}`} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">{u.fullName?.[0]?.toUpperCase() || "U"}</div>
                          )}
                        </td>
                        <td className="py-4 px-6 font-semibold">{u.fullName}</td>
                        <td className="py-4 px-6 text-slate-500">@{u.username}</td>
                        <td className="py-4 px-6 text-slate-500">{u.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${u.role === "admin" ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setDeleteConfirm({ open: true, id: u._id, name: u.fullName, type: "users" })} disabled={u._id === currentUser._id} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30" title="Delete User">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "listings" ? (
            listings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">No rooms posted yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Preview</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Rent</th>
                      <th className="py-4 px-6">Owner</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {listings.map((l) => (
                      <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6"><img src={l.image?.startsWith("http") ? l.image : `http://localhost:8089/uploads/${l.image}`} alt={l.title} className="w-12 h-8 rounded object-cover" /></td>
                        <td className="py-4 px-6 font-semibold line-clamp-1 max-w-xs">{l.title}</td>
                        <td className="py-4 px-6 text-slate-500">{l.location}</td>
                        <td className="py-4 px-6 font-bold text-teal-600">Rs. {l.rent}</td>
                        <td className="py-4 px-6 text-slate-500">{l.owner?.fullName || "System Admin"}</td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setDeleteConfirm({ open: true, id: l._id, name: l.title, type: "listings" })} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "applications" ? (
            applications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">No applications yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Applicant</th>
                      <th className="py-4 px-6">Listing</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {applications.map((a: any) => (
                      <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold">{a.applicant?.fullName || a.applicant?.username || "Unknown"}</td>
                        <td className="py-4 px-6 text-slate-500">{a.listing?.title || "Deleted listing"}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                            a.status === "accepted" ? "bg-green-50 text-green-700" : a.status === "rejected" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                          }`}>{a.status}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setDeleteConfirm({ open: true, id: a._id, name: `application by ${a.applicant?.fullName || "user"}`, type: "applications" })} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">No reviews yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Reviewer</th>
                      <th className="py-4 px-6">Reviewee</th>
                      <th className="py-4 px-6">Rating</th>
                      <th className="py-4 px-6">Comment</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {reviews.map((r: any) => (
                      <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold">{r.reviewer?.fullName || r.reviewer?.username || "Unknown"}</td>
                        <td className="py-4 px-6 text-slate-500">{r.reviewee?.fullName || r.reviewee?.username || "Unknown"}</td>
                        <td className="py-4 px-6">
                          <span className="text-amber-500 font-bold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{r.comment}</td>
                        <td className="py-4 px-6 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setDeleteConfirm({ open: true, id: r._id, name: `review by ${r.reviewer?.fullName || "user"}`, type: "reviews" })} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title={`Delete ${deleteConfirm.type.slice(0, -1)}`}
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "", type: "users" })}
      />
    </div>
  );
}

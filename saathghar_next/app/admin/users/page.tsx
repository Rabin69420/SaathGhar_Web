"use client";

import { useEffect, useState } from "react";
import { handleGetAdminUsers, handleDeleteAdminUser } from "@/lib/actions/admin-action";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/component/common/ConfirmModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({
    open: false, id: "", name: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    const res = await handleGetAdminUsers();
    if (res.success && res.data) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDelete = async () => {
    const res = await handleDeleteAdminUser(deleteConfirm.id);
    if (res.success) {
      toast.success(res.message || "User deleted!");
      loadUsers();
    } else {
      toast.error(res.message || "Delete failed");
    }
    setDeleteConfirm({ open: false, id: "", name: "" });
  };

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Users</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all registered users.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : users.length === 0 ? (
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
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        {u.imageUrl ? (
                          <img
                            src={u.imageUrl.startsWith("http") ? u.imageUrl : `http://localhost:8089${u.imageUrl}`}
                            alt={u.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
                            {u.fullName?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold">{u.fullName}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">@{u.username}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          u.role === "admin"
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setDeleteConfirm({ open: true, id: u._id, name: u.fullName })}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all disabled:opacity-30"
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
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "" })}
      />
    </div>
  );
}

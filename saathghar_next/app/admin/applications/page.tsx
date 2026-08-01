"use client";

import { useEffect, useState } from "react";
import {
  handleGetAdminApplications,
  handleDeleteAdminApplication,
  handleUpdateAdminApplicationStatus,
} from "@/lib/actions/admin-action";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/component/common/ConfirmModal";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({
    open: false, id: "", name: "",
  });

  const loadApplications = async () => {
    setLoading(true);
    const res = await handleGetAdminApplications();
    if (res.success && res.data) setApplications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    const res = await handleUpdateAdminApplicationStatus(id, status);
    if (res.success) {
      toast.success(res.message || `Application ${status}!`);
      loadApplications();
    } else {
      toast.error(res.message || "Action failed");
    }
  };

  const confirmDelete = async () => {
    const res = await handleDeleteAdminApplication(deleteConfirm.id);
    if (res.success) {
      toast.success(res.message || "Application deleted!");
      loadApplications();
    } else {
      toast.error(res.message || "Delete failed");
    }
    setDeleteConfirm({ open: false, id: "", name: "" });
  };

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage room applications.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">No applications yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Applicant</th>
                    <th className="py-4 px-6">Listing</th>
                    <th className="py-4 px-6">Message</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  {applications.map((a: any) => (
                    <tr key={a._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        {a.applicant?.fullName || a.applicant?.username || "Unknown"}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {a.listing?.title || "Deleted listing"}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {a.message}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                            a.status === "accepted"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : a.status === "approved"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                              : a.status === "rejected"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                          }`}
                        >
                          {a.status === "pending" ? "Pending Review" : a.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(a._id, "approved")}
                                className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                title="Approve & forward to listing owner"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(a._id, "rejected")}
                                className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Decline application"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                id: a._id,
                                name: `application by ${a.applicant?.fullName || "user"}`,
                              })
                            }
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
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
        title="Delete Application"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "" })}
      />
    </div>
  );
}

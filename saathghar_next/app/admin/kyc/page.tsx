"use client";

import { useEffect, useState } from "react";
import { handleGetPendingKyc, handleReviewKyc } from "@/lib/actions/kyc-action";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/component/common/ConfirmModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export default function AdminKycPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; userId: string; name: string }>({
    open: false, userId: "", name: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    const res = await handleGetPendingKyc();
    if (res.success && res.data) setSubmissions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    const res = await handleReviewKyc(userId, "verified");
    if (res.success) {
      toast.success(res.message || "KYC approved!");
      loadSubmissions();
    } else {
      toast.error(res.message || "Approval failed");
    }
    setActionLoading(null);
  };

  const confirmReject = async () => {
    setActionLoading(rejectModal.userId);
    const res = await handleReviewKyc(rejectModal.userId, "rejected", rejectReason || undefined);
    if (res.success) {
      toast.success(res.message || "KYC rejected.");
      loadSubmissions();
    } else {
      toast.error(res.message || "Rejection failed");
    }
    setRejectModal({ open: false, userId: "", name: "" });
    setRejectReason("");
    setActionLoading(null);
  };

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">KYC Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and verify user identity documents.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No pending KYC submissions.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6">Documents</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  {submissions.map((s: any) => (
                    <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold">{s.fullName || "Unknown"}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{s.email}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {s.kycDocuments?.[0]?.uploadedAt
                          ? new Date(s.kycDocuments[0].uploadedAt).toLocaleDateString()
                          : new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                          className="px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
                        >
                          {expandedId === s._id ? "Hide" : "View"} Documents
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(s._id)}
                            disabled={actionLoading === s._id}
                            className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === s._id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, userId: s._id, name: s.fullName || "user" })}
                            disabled={actionLoading === s._id}
                            className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Expanded document viewer */}
              {expandedId && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-6">
                  {(() => {
                    const submission = submissions.find((s: any) => s._id === expandedId);
                    if (!submission?.kycDocuments?.length) return <p className="text-sm text-slate-500">No documents uploaded.</p>;
                    return (
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                          ID Documents for {submission.fullName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {submission.kycDocuments.map((doc: any, i: number) => (
                            <div key={i} className="text-center">
                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                {doc.type} side
                              </p>
                              <img
                                src={`${API_BASE}/uploads/${doc.filename}`}
                                alt={`ID ${doc.type}`}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 max-h-64 mx-auto object-contain bg-white dark:bg-slate-900"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal with reason input */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Reject KYC</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Reject KYC for <span className="font-semibold">{rejectModal.name}</span>? Optionally provide a reason.
            </p>
            <textarea
              rows={3}
              placeholder="Reason for rejection (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-300 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectModal({ open: false, userId: "", name: "" }); setRejectReason(""); }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

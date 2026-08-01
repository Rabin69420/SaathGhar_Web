"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleSubmitKyc, handleGetKycStatus } from "@/lib/actions/kyc-action";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export default function KycPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("unverified");
  const [kycDocuments, setKycDocuments] = useState<any[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    const res = await handleGetKycStatus();
    if (res.success && res.data) {
      setKycStatus(res.data.kycStatus || "unverified");
      setKycDocuments(res.data.kycDocuments || []);
      setRejectionReason(res.data.kycRejectionReason || "");
    }
    setLoading(false);
  };

  const handleFileChange = (side: "front" | "back", file: File | null) => {
    if (side === "front") {
      setFrontFile(file);
      setFrontPreview(file ? URL.createObjectURL(file) : "");
    } else {
      setBackFile(file);
      setBackPreview(file ? URL.createObjectURL(file) : "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !backFile) {
      toast.error("Please upload both front and back of your ID");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("front", frontFile);
      formData.append("back", backFile);

      const res = await handleSubmitKyc(formData);
      if (res.success) {
        toast.success("KYC documents submitted! Please wait for admin review.");
        setFrontFile(null);
        setBackFile(null);
        setFrontPreview("");
        setBackPreview("");
        loadStatus();
      } else {
        toast.error(res.message || "Failed to submit KYC documents");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 py-8 px-6 md:px-12 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">KYC Verification</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Verify your identity to post listings and apply to rooms.
            </p>
          </div>
        </div>

        {/* Verified */}
        {kycStatus === "verified" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-green-200 dark:border-green-800 shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Identity Verified</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Your KYC has been approved. You can now post room listings and apply to rooms.
            </p>
          </div>
        )}

        {/* Pending */}
        {kycStatus === "pending" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Under Review</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Your KYC documents have been submitted and are under review. You will be notified once the admin makes a decision.
            </p>
            {kycDocuments.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {kycDocuments.map((doc: any, i: number) => (
                  <div key={i} className="text-center">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                      {doc.type} side
                    </p>
                    <img
                      src={`${API_BASE}/uploads/${doc.filename}`}
                      alt={`ID ${doc.type}`}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 max-h-40 mx-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rejected */}
        {kycStatus === "rejected" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-800 shadow-md p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-700 dark:text-red-400">KYC Rejected</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {rejectionReason || "Your KYC submission was rejected. Please resubmit with valid documents."}
                  </p>
                </div>
              </div>
            </div>
            {renderUploadForm()}
          </div>
        )}

        {/* Unverified - first time */}
        {kycStatus === "unverified" && renderUploadForm()}
      </div>
    </div>
  );

  function renderUploadForm() {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md p-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Submit Your National ID</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Upload clear photos of the front and back of your national ID card.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Front of ID
              </label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-teal-400 dark:hover:border-teal-600 transition-colors">
                {frontPreview ? (
                  <div className="relative">
                    <img src={frontPreview} alt="Front preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <button
                      type="button"
                      onClick={() => handleFileChange("front", null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Click to upload front</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Back */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Back of ID
              </label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-teal-400 dark:hover:border-teal-600 transition-colors">
                {backPreview ? (
                  <div className="relative">
                    <img src={backPreview} alt="Back preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <button
                      type="button"
                      onClick={() => handleFileChange("back", null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Click to upload back</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Accepted formats: JPEG, PNG, WebP. Max 5MB per file.
          </p>

          <button
            type="submit"
            disabled={submitting || !frontFile || !backFile}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit for Verification"
            )}
          </button>
        </form>
      </div>
    );
  }
}

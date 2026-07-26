"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetMyApplications, handleGetApplicationsForListing, handleUpdateApplicationStatus, handleDeleteApplication } from "@/lib/actions/applications-action";
import { getUserData } from "@/lib/cookies-client";
import ConfirmModal from "@/app/component/common/ConfirmModal";
import Link from "next/link";

interface Application {
    _id: string;
    listing: {
        _id: string;
        title: string;
        location: string;
        rent: number;
        owner: {
            _id: string;
            fullName: string;
            username: string;
        };
    };
    applicant: {
        _id: string;
        fullName: string;
        username: string;
        email: string;
        imageUrl?: string;
    };
    message: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
}

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
    const [sentApplications, setSentApplications] = useState<Application[]>([]);
    const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "default"; action: () => void }>({
        open: false, title: "", message: "", variant: "default", action: () => {}
    });

    const user = getUserData();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const sentRes = await handleGetMyApplications();
            if (sentRes.success) {
                setSentApplications(sentRes.data || []);
            }
        } catch {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: "accepted" | "rejected") => {
        const result = await handleUpdateApplicationStatus(id, status);
        if (result.success) {
            toast.success(result.message);
            setReceivedApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
        } else {
            toast.error(result.message);
        }
    };

    const handleWithdraw = async (id: string) => {
        const result = await handleDeleteApplication(id);
        if (result.success) {
            toast.success(result.message);
            setSentApplications(prev => prev.filter(app => app._id !== id));
        } else {
            toast.error(result.message);
        }
    };

    const statusBadge = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status as keyof typeof colors]}`}>
                {status}
            </span>
        );
    };

    const handleTabChange = async (tab: "sent" | "received") => {
        setActiveTab(tab);
        if (tab === "received" && receivedApplications.length === 0) {
            setLoading(true);
            try {
                const res = await handleGetMyApplications();
                if (res.success && res.data) {
                    const myListingIds = res.data
                        .filter((app: Application) => app.listing?.owner?._id === user?._id)
                        .map((app: Application) => app.listing?._id);

                    const uniqueListingIds = [...new Set(myListingIds)] as string[];
                    const allReceived: Application[] = [];

                    for (const listingId of uniqueListingIds) {
                        const listingRes = await handleGetApplicationsForListing(listingId);
                        if (listingRes.success && listingRes.data) {
                            allReceived.push(...listingRes.data);
                        }
                    }
                    setReceivedApplications(allReceived);
                }
            } catch {
                toast.error("Failed to load received applications");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Applications</h1>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => handleTabChange("sent")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "sent" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                        My Applications
                    </button>
                    <button
                        onClick={() => handleTabChange("received")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "received" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                        Received Applications
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : activeTab === "sent" ? (
                    sentApplications.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No applications yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Browse listings and apply to rooms that interest you.</p>
                            <Link href="/dashboard" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                Browse Listings
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sentApplications.map(app => (
                                <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Link href={`/dashboard/listings/${app.listing?._id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                                                    {app.listing?.title || "Listing removed"}
                                                </Link>
                                                {statusBadge(app.status)}
                                            </div>
                                            {app.listing && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    {app.listing.location} &middot; Rs. {app.listing.rent}/mo
                                                </p>
                                            )}
                                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">&ldquo;{app.message}&rdquo;</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {app.status === "pending" && (
                                            <button
                                                onClick={() => setConfirmModal({
                                                    open: true,
                                                    title: "Withdraw Application",
                                                    message: "Are you sure you want to withdraw this application? This action cannot be undone.",
                                                    variant: "danger",
                                                    action: () => handleWithdraw(app._id)
                                                })}
                                                className="ml-4 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    receivedApplications.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No applications received</h3>
                            <p className="text-gray-500 dark:text-gray-400">When someone applies to your listings, they&apos;ll appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {receivedApplications.map(app => (
                                <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {app.applicant?.fullName || app.applicant?.username}
                                                </span>
                                                {statusBadge(app.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Applied to: <Link href={`/dashboard/listings/${app.listing?._id}`} className="text-purple-600 dark:text-purple-400 hover:underline">{app.listing?.title}</Link>
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">&ldquo;{app.message}&rdquo;</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {app.applicant?.email} &middot; {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {app.status === "pending" && (
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, "accepted")}
                                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => setConfirmModal({
                                                        open: true,
                                                        title: "Reject Application",
                                                        message: `Reject the application from ${app.applicant?.fullName || app.applicant?.username}?`,
                                                        variant: "danger",
                                                        action: () => handleStatusUpdate(app._id, "rejected")
                                                    })}
                                                    className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                onConfirm={() => { confirmModal.action(); setConfirmModal(prev => ({ ...prev, open: false })); }}
                onCancel={() => setConfirmModal(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
}

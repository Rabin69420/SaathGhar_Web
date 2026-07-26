"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleGetMyReviews, handleDeleteReview } from "@/lib/actions/reviews-action";
import { getUserData } from "@/lib/cookies-client";
import StarRating from "@/app/component/common/StarRating";
import ConfirmModal from "@/app/component/common/ConfirmModal";
import Link from "next/link";

interface Review {
    _id: string;
    reviewer: {
        _id: string;
        fullName: string;
        username: string;
        imageUrl?: string;
    };
    reviewee: {
        _id: string;
        fullName: string;
        username: string;
        imageUrl?: string;
    };
    listing?: {
        _id: string;
        title: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsPage() {
    const [activeTab, setActiveTab] = useState<"written" | "received">("received");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; reviewId: string }>({ open: false, reviewId: "" });
    const router = useRouter();
    const user = getUserData();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await handleGetMyReviews();
            if (res.success) {
                setReviews(res.data || []);
            }
        } catch {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const writtenReviews = reviews.filter(r => r.reviewer?._id === user?._id);
    const receivedReviews = reviews.filter(r => r.reviewee?._id === user?._id);
    const displayReviews = activeTab === "written" ? writtenReviews : receivedReviews;

    const handleDelete = async (id: string) => {
        const result = await handleDeleteReview(id);
        if (result.success) {
            toast.success(result.message);
            setReviews(prev => prev.filter(r => r._id !== id));
        } else {
            toast.error(result.message);
        }
    };

    const avgRating = receivedReviews.length > 0
        ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reviews</h1>
                        {avgRating && (
                            <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={parseFloat(avgRating)} size="sm" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{avgRating} average ({receivedReviews.length} reviews)</span>
                            </div>
                        )}
                    </div>
                    <Link href="/dashboard/reviews/new" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                        Write a Review
                    </Link>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("received")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "received" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                        Reviews About Me ({receivedReviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("written")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "written" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                        Reviews I Wrote ({writtenReviews.length})
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : displayReviews.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {activeTab === "written" ? "No reviews written yet" : "No reviews received yet"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {activeTab === "written" ? "Share your experience with roommates you've interacted with." : "Reviews from other users will appear here."}
                        </p>
                        {activeTab === "written" && (
                            <Link href="/dashboard/reviews/new" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                Write Your First Review
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayReviews.map(review => (
                            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {activeTab === "received" ? (review.reviewer?.fullName || review.reviewer?.username) : (review.reviewee?.fullName || review.reviewee?.username)}
                                            </span>
                                            <StarRating rating={review.rating} size="sm" />
                                        </div>
                                        {review.listing && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                Re: <Link href={`/dashboard/listings/${review.listing._id}`} className="text-purple-600 dark:text-purple-400 hover:underline">{review.listing.title}</Link>
                                            </p>
                                        )}
                                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {activeTab === "written" && (
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => router.push(`/dashboard/reviews/${review._id}`)}
                                                className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, reviewId: review._id })}
                                                className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModal.open}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                variant="danger"
                onConfirm={() => { handleDelete(deleteModal.reviewId); setDeleteModal({ open: false, reviewId: "" }); }}
                onCancel={() => setDeleteModal({ open: false, reviewId: "" })}
            />
        </div>
    );
}

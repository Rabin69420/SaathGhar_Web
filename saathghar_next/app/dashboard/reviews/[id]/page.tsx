"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleGetReviewById, handleUpdateReview, handleDeleteReview } from "@/lib/actions/reviews-action";
import StarRating from "@/app/component/common/StarRating";
import ConfirmModal from "@/app/component/common/ConfirmModal";
import Link from "next/link";

export default function ReviewDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [review, setReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        fetchReview();
    }, [id]);

    const fetchReview = async () => {
        setLoading(true);
        const res = await handleGetReviewById(id as string);
        if (res.success) {
            setReview(res.data);
            setRating(res.data.rating);
            setComment(res.data.comment);
        } else {
            toast.error(res.message);
            router.push("/dashboard/reviews");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (comment.length < 10) {
            toast.error("Comment must be at least 10 characters");
            return;
        }
        setSubmitting(true);
        const res = await handleUpdateReview(id as string, { rating, comment });
        if (res.success) {
            toast.success(res.message);
            setReview({ ...review, rating, comment });
            setEditing(false);
        } else {
            toast.error(res.message);
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        const res = await handleDeleteReview(id as string);
        if (res.success) {
            toast.success(res.message);
            router.push("/dashboard/reviews");
        } else {
            toast.error(res.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                </div>
            </div>
        );
    }

    if (!review) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard/reviews" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Reviews
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Review for {review.reviewee?.fullName || review.reviewee?.username}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                By {review.reviewer?.fullName || review.reviewer?.username} &middot; {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {!editing && (
                                <>
                                    <button onClick={() => setEditing(true)} className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => setDeleteModal(true)} className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {review.listing && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Regarding: <Link href={`/dashboard/listings/${review.listing._id}`} className="text-purple-600 dark:text-purple-400 hover:underline">{review.listing.title}</Link>
                        </p>
                    )}

                    {editing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                <StarRating rating={rating} size="lg" interactive onChange={setRating} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    minLength={10}
                                    maxLength={1000}
                                />
                                <p className="text-xs text-gray-400 mt-1">{comment.length}/1000</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={() => { setEditing(false); setRating(review.rating); setComment(review.comment); }}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <StarRating rating={review.rating} size="md" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{review.comment}</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                variant="danger"
                onConfirm={() => { handleDelete(); setDeleteModal(false); }}
                onCancel={() => setDeleteModal(false)}
            />
        </div>
    );
}

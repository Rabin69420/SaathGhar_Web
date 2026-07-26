"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { handleCreateReview } from "@/lib/actions/reviews-action";
import StarRating from "@/app/component/common/StarRating";
import Link from "next/link";

export default function NewReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefillReviewee = searchParams.get("reviewee") || "";
    const prefillListing = searchParams.get("listing") || "";

    const [reviewee, setReviewee] = useState(prefillReviewee);
    const [listing, setListing] = useState(prefillListing);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reviewee.trim()) {
            toast.error("Please enter the user ID to review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (comment.length < 10) {
            toast.error("Comment must be at least 10 characters");
            return;
        }

        setSubmitting(true);
        const data: { reviewee: string; listing?: string; rating: number; comment: string } = {
            reviewee: reviewee.trim(),
            rating,
            comment: comment.trim(),
        };
        if (listing.trim()) {
            data.listing = listing.trim();
        }

        const res = await handleCreateReview(data);
        if (res.success) {
            toast.success(res.message);
            router.push("/dashboard/reviews");
        } else {
            toast.error(res.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard/reviews" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Reviews
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                User ID to Review *
                            </label>
                            <input
                                type="text"
                                value={reviewee}
                                onChange={(e) => setReviewee(e.target.value)}
                                placeholder="Enter the user's ID"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">You can find user IDs on listing detail pages</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Listing ID (optional)
                            </label>
                            <input
                                type="text"
                                value={listing}
                                onChange={(e) => setListing(e.target.value)}
                                placeholder="Related listing ID (optional)"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rating *
                            </label>
                            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
                            {rating > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Comment * <span className="text-gray-400 font-normal">(10-1000 characters)</span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                placeholder="Share your experience with this roommate..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                minLength={10}
                                maxLength={1000}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">{comment.length}/1000</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <Link
                                href="/dashboard/reviews"
                                className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

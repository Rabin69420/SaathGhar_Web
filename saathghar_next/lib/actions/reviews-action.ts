"use server";

import { createReview, getMyReviews, getReviewsForUser, getReviewsForListing, getReviewById, updateReview, deleteReview } from "../api/reviews";
import { revalidatePath } from "next/cache";

export const handleCreateReview = async (data: { reviewee: string; listing?: string; rating: number; comment: string }) => {
    try {
        const response = await createReview(data);
        if (response.success) {
            revalidatePath("/dashboard/reviews");
            return { success: true, data: response.data, message: "Review created successfully" };
        }
        return { success: false, message: response.message || "Failed to create review" };
    } catch (error: any) {
        return { success: false, message: error.message || "Create review failed" };
    }
};

export const handleGetMyReviews = async () => {
    try {
        const response = await getMyReviews();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch reviews" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch reviews failed" };
    }
};

export const handleGetReviewsForUser = async (userId: string) => {
    try {
        const response = await getReviewsForUser(userId);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch user reviews" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch user reviews failed" };
    }
};

export const handleGetReviewsForListing = async (listingId: string) => {
    try {
        const response = await getReviewsForListing(listingId);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch listing reviews" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch listing reviews failed" };
    }
};

export const handleGetReviewById = async (id: string) => {
    try {
        const response = await getReviewById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch review" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch review failed" };
    }
};

export const handleUpdateReview = async (id: string, data: { rating?: number; comment?: string }) => {
    try {
        const response = await updateReview(id, data);
        if (response.success) {
            revalidatePath("/dashboard/reviews");
            return { success: true, data: response.data, message: "Review updated successfully" };
        }
        return { success: false, message: response.message || "Failed to update review" };
    } catch (error: any) {
        return { success: false, message: error.message || "Update review failed" };
    }
};

export const handleDeleteReview = async (id: string) => {
    try {
        const response = await deleteReview(id);
        if (response.success) {
            revalidatePath("/dashboard/reviews");
            return { success: true, message: "Review deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete review" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete review failed" };
    }
};

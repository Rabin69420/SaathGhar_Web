import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const createReview = async (data: { reviewee: string; listing?: string; rating: number; comment: string }) => {
    try {
        const response = await axiosInstance.post(API.REVIEWS.BASE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create review");
    }
};

export const getMyReviews = async () => {
    try {
        const response = await axiosInstance.get(API.REVIEWS.MY_REVIEWS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch my reviews");
    }
};

export const getReviewsForUser = async (userId: string) => {
    try {
        const response = await axiosInstance.get(API.REVIEWS.FOR_USER(userId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch user reviews");
    }
};

export const getReviewsForListing = async (listingId: string) => {
    try {
        const response = await axiosInstance.get(API.REVIEWS.FOR_LISTING(listingId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch listing reviews");
    }
};

export const getReviewById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.REVIEWS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch review");
    }
};

export const updateReview = async (id: string, data: { rating?: number; comment?: string }) => {
    try {
        const response = await axiosInstance.put(API.REVIEWS.DETAIL(id), data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update review");
    }
};

export const deleteReview = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.REVIEWS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete review");
    }
};

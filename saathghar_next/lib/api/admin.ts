import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getAdminStats = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.STATS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin stats");
    }
};

export const getAdminUsers = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.USERS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin users");
    }
};

export const deleteAdminUser = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.DELETE_USER(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete user");
    }
};

export const getAdminListings = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.LISTINGS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin listings");
    }
};

export const deleteAdminListing = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.DELETE_LISTING(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete listing");
    }
};

export const getAdminApplications = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.APPLICATIONS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin applications");
    }
};

export const deleteAdminApplication = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.DELETE_APPLICATION(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete application");
    }
};

export const updateAdminApplicationStatus = async (id: string, status: "approved" | "rejected") => {
    try {
        const response = await axiosInstance.put(API.APPLICATIONS.UPDATE_STATUS(id), { status });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update application status");
    }
};

export const getAdminReviews = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.REVIEWS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch admin reviews");
    }
};

export const deleteAdminReview = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.DELETE_REVIEW(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete review");
    }
};

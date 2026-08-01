"use server";

import { getAdminStats, getAdminUsers, deleteAdminUser, getAdminListings, deleteAdminListing, getAdminApplications, deleteAdminApplication, updateAdminApplicationStatus, getAdminReviews, deleteAdminReview } from "../api/admin";
import { revalidatePath } from "next/cache";

export const handleGetAdminStats = async () => {
    try {
        const response = await getAdminStats();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch admin stats" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch admin stats action failed" };
    }
};

export const handleGetAdminUsers = async () => {
    try {
        const response = await getAdminUsers();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch admin users" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch admin users action failed" };
    }
};

export const handleDeleteAdminUser = async (id: string) => {
    try {
        const response = await deleteAdminUser(id);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete user" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete user action failed" };
    }
};

export const handleGetAdminListings = async () => {
    try {
        const response = await getAdminListings();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch admin listings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch admin listings action failed" };
    }
};

export const handleDeleteAdminListing = async (id: string) => {
    try {
        const response = await deleteAdminListing(id);
        if (response.success) {
            revalidatePath("/dashboard");
            revalidatePath("/admin/listings");
            return { success: true, message: "Listing deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete listing" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete listing action failed" };
    }
};

export const handleGetAdminApplications = async () => {
    try {
        const response = await getAdminApplications();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch applications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch admin applications failed" };
    }
};

export const handleDeleteAdminApplication = async (id: string) => {
    try {
        const response = await deleteAdminApplication(id);
        if (response.success) {
            revalidatePath("/admin/applications");
            return { success: true, message: "Application deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete application action failed" };
    }
};

export const handleUpdateAdminApplicationStatus = async (id: string, status: "approved" | "rejected") => {
    try {
        const response = await updateAdminApplicationStatus(id, status);
        if (response.success) {
            revalidatePath("/admin/applications");
            revalidatePath("/dashboard/applications");
            return { success: true, message: `Application ${status} successfully` };
        }
        return { success: false, message: response.message || "Failed to update application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Update application action failed" };
    }
};

export const handleGetAdminReviews = async () => {
    try {
        const response = await getAdminReviews();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch reviews" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch admin reviews failed" };
    }
};

export const handleDeleteAdminReview = async (id: string) => {
    try {
        const response = await deleteAdminReview(id);
        if (response.success) {
            revalidatePath("/admin/reviews");
            return { success: true, message: "Review deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete review" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete review action failed" };
    }
};

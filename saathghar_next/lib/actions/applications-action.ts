"use server";

import { createApplication, getMyApplications, getApplicationsForListing, getApplicationById, updateApplicationStatus, deleteApplication } from "../api/applications";
import { revalidatePath } from "next/cache";

export const handleCreateApplication = async (data: { listing: string; message: string }) => {
    try {
        const response = await createApplication(data);
        if (response.success) {
            revalidatePath("/dashboard/applications");
            return { success: true, data: response.data, message: "Application submitted successfully" };
        }
        return { success: false, message: response.message || "Failed to submit application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Application submission failed" };
    }
};

export const handleGetMyApplications = async () => {
    try {
        const response = await getMyApplications();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch applications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch applications failed" };
    }
};

export const handleGetApplicationsForListing = async (listingId: string) => {
    try {
        const response = await getApplicationsForListing(listingId);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch listing applications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch listing applications failed" };
    }
};

export const handleGetApplicationById = async (id: string) => {
    try {
        const response = await getApplicationById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch application failed" };
    }
};

export const handleUpdateApplicationStatus = async (id: string, status: "approved" | "accepted" | "rejected") => {
    try {
        const response = await updateApplicationStatus(id, status);
        if (response.success) {
            revalidatePath("/dashboard/applications");
            return { success: true, data: response.data, message: `Application ${status} successfully` };
        }
        return { success: false, message: response.message || "Failed to update application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Update application failed" };
    }
};

export const handleDeleteApplication = async (id: string) => {
    try {
        const response = await deleteApplication(id);
        if (response.success) {
            revalidatePath("/dashboard/applications");
            return { success: true, message: "Application withdrawn successfully" };
        }
        return { success: false, message: response.message || "Failed to withdraw application" };
    } catch (error: any) {
        return { success: false, message: error.message || "Withdraw application failed" };
    }
};

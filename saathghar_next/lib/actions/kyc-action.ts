"use server";

import { submitKycDocuments, getKycStatus, getPendingKycSubmissions, reviewKycSubmission } from "../api/kyc";
import { revalidatePath } from "next/cache";

export const handleSubmitKyc = async (formData: FormData) => {
    try {
        const response = await submitKycDocuments(formData);
        if (response.success) {
            revalidatePath("/dashboard/kyc");
            return { success: true, message: "KYC documents submitted successfully" };
        }
        return { success: false, message: response.message || "Failed to submit KYC documents" };
    } catch (error: any) {
        return { success: false, message: error.message || "Submit KYC action failed" };
    }
};

export const handleGetKycStatus = async () => {
    try {
        const response = await getKycStatus();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch KYC status" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch KYC status action failed" };
    }
};

export const handleGetPendingKyc = async () => {
    try {
        const response = await getPendingKycSubmissions();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch pending KYC" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch pending KYC action failed" };
    }
};

export const handleReviewKyc = async (userId: string, decision: "verified" | "rejected", reason?: string) => {
    try {
        const response = await reviewKycSubmission(userId, decision, reason);
        if (response.success) {
            revalidatePath("/admin/kyc");
            return { success: true, message: `KYC ${decision} successfully` };
        }
        return { success: false, message: response.message || "Failed to review KYC" };
    } catch (error: any) {
        return { success: false, message: error.message || "Review KYC action failed" };
    }
};

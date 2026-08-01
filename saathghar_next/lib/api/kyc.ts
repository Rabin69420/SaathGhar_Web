import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const submitKycDocuments = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(API.KYC.SUBMIT, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to submit KYC documents");
    }
};

export const getKycStatus = async () => {
    try {
        const response = await axiosInstance.get(API.KYC.STATUS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch KYC status");
    }
};

export const getPendingKycSubmissions = async () => {
    try {
        const response = await axiosInstance.get(API.KYC.PENDING);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch pending KYC submissions");
    }
};

export const reviewKycSubmission = async (userId: string, decision: "verified" | "rejected", reason?: string) => {
    try {
        const response = await axiosInstance.patch(API.KYC.REVIEW(userId), { decision, reason });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to review KYC submission");
    }
};

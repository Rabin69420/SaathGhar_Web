import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const createApplication = async (data: { listing: string; message: string }) => {
    try {
        const response = await axiosInstance.post(API.APPLICATIONS.BASE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create application");
    }
};

export const getMyApplications = async () => {
    try {
        const response = await axiosInstance.get(API.APPLICATIONS.MY_APPLICATIONS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch applications");
    }
};

export const getApplicationsForListing = async (listingId: string) => {
    try {
        const response = await axiosInstance.get(API.APPLICATIONS.FOR_LISTING(listingId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch listing applications");
    }
};

export const getApplicationById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.APPLICATIONS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch application");
    }
};

export const updateApplicationStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
        const response = await axiosInstance.put(API.APPLICATIONS.UPDATE_STATUS(id), { status });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update application status");
    }
};

export const deleteApplication = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.APPLICATIONS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to withdraw application");
    }
};

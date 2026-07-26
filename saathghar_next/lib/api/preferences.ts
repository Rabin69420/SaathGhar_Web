import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getPreferences = async () => {
    try {
        const response = await axiosInstance.get(API.AUTH.PREFERENCES);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch preferences");
    }
};

export const updatePreferences = async (data: Record<string, any>) => {
    try {
        const response = await axiosInstance.put(API.AUTH.PREFERENCES, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update preferences");
    }
};

export const resetPreferences = async () => {
    try {
        const response = await axiosInstance.delete(API.AUTH.PREFERENCES);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to reset preferences");
    }
};

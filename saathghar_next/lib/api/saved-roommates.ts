import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getSavedRoommates = async () => {
    try {
        const response = await axiosInstance.get(API.AUTH.SAVED_ROOMMATES);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch saved roommates");
    }
};

export const toggleSavedRoommate = async (roommateId: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.TOGGLE_SAVED_ROOMMATE(roommateId));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to toggle saved roommate");
    }
};

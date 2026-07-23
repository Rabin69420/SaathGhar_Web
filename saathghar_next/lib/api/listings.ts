import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface CreateListingInput {
    title: string;
    description: string;
    rent: number;
    location: string;
    image: string;
    video?: string;
}

export const getListings = async () => {
    try {
        const response = await axiosInstance.get(API.LISTINGS.BASE);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch listings");
    }
};

export const getListingById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.LISTINGS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch listing");
    }
};

export const createListing = async (data: CreateListingInput) => {
    try {
        const response = await axiosInstance.post(API.LISTINGS.BASE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create listing");
    }
};

export const updateListing = async (id: string, data: Partial<CreateListingInput>) => {
    try {
        const response = await axiosInstance.put(API.LISTINGS.DETAIL(id), data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update listing");
    }
};

export const deleteListing = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.LISTINGS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete listing");
    }
};

export const uploadMediaFile = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(API.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to upload file");
    }
};

export const getMyListings = async () => {
    try {
        const response = await axiosInstance.get(API.LISTINGS.MY_LISTINGS);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch user listings");
    }
};

export const getBookmarkedListings = async () => {
    try {
        const response = await axiosInstance.get(API.LISTINGS.BOOKMARKED);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch bookmarked listings");
    }
};

export const toggleBookmark = async (id: string) => {
    try {
        const response = await axiosInstance.post(API.LISTINGS.BOOKMARK(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to toggle bookmark");
    }
};

export const getCompatibility = async (id: string, customPreferences?: any) => {
    try {
        const response = await axiosInstance.post(API.LISTINGS.COMPATIBILITY(id), { customPreferences });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to check compatibility");
    }
};

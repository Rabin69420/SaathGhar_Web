"use server";

import { getListings, getListingById, createListing, updateListing, deleteListing, uploadMediaFile, CreateListingInput, getMyListings, getBookmarkedListings, toggleBookmark, getCompatibility } from "../api/listings";
import { revalidatePath } from "next/cache";

export const handleGetListings = async () => {
    try {
        const response = await getListings();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch listings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch listings action failed" };
    }
};

export const handleGetListingById = async (id: string) => {
    try {
        const response = await getListingById(id);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch listing" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch listing details action failed" };
    }
};

export const handleCreateListing = async (data: CreateListingInput) => {
    try {
        const response = await createListing(data);
        if (response.success) {
            revalidatePath("/dashboard");
            return { success: true, message: "Listing created successfully", data: response.data };
        }
        return { success: false, message: response.message || "Failed to create listing" };
    } catch (error: any) {
        return { success: false, message: error.message || "Create listing action failed" };
    }
};

export const handleUpdateListing = async (id: string, data: Partial<CreateListingInput>) => {
    try {
        const response = await updateListing(id, data);
        if (response.success) {
            revalidatePath("/dashboard");
            revalidatePath(`/dashboard/listings/${id}`);
            return { success: true, message: "Listing updated successfully", data: response.data };
        }
        return { success: false, message: response.message || "Failed to update listing" };
    } catch (error: any) {
        return { success: false, message: error.message || "Update listing action failed" };
    }
};

export const handleDeleteListing = async (id: string) => {
    try {
        const response = await deleteListing(id);
        if (response.success) {
            revalidatePath("/dashboard");
            return { success: true, message: "Listing deleted successfully" };
        }
        return { success: false, message: response.message || "Failed to delete listing" };
    } catch (error: any) {
        return { success: false, message: error.message || "Delete listing action failed" };
    }
};

export const handleUploadMedia = async (formData: FormData) => {
    try {
        const response = await uploadMediaFile(formData);
        if (response.success) {
            return { success: true, filename: response.data.filename };
        }
        return { success: false, message: response.message || "Upload failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Upload media action failed" };
    }
};

export const handleGetMyListings = async () => {
    try {
        const response = await getMyListings();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch user listings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch user listings action failed" };
    }
};

export const handleGetBookmarkedListings = async () => {
    try {
        const response = await getBookmarkedListings();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch bookmarked listings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch bookmarked listings action failed" };
    }
};

export const handleToggleBookmark = async (id: string) => {
    try {
        const response = await toggleBookmark(id);
        if (response.success) {
            revalidatePath("/dashboard");
            revalidatePath(`/dashboard/listings/${id}`);
            return { success: true, data: response.data, message: response.message };
        }
        return { success: false, message: response.message || "Failed to toggle bookmark" };
    } catch (error: any) {
        return { success: false, message: error.message || "Toggle bookmark action failed" };
    }
};

export const handleCheckCompatibility = async (id: string, customPreferences?: any) => {
    try {
        const response = await getCompatibility(id, customPreferences);
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to run compatibility check" };
    } catch (error: any) {
        return { success: false, message: error.message || "Compatibility checker action failed" };
    }
};

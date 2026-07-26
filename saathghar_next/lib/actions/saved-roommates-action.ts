"use server";

import { getSavedRoommates, toggleSavedRoommate } from "../api/saved-roommates";
import { revalidatePath } from "next/cache";

export const handleGetSavedRoommates = async () => {
    try {
        const response = await getSavedRoommates();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch saved roommates" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch saved roommates failed" };
    }
};

export const handleToggleSavedRoommate = async (roommateId: string) => {
    try {
        const response = await toggleSavedRoommate(roommateId);
        if (response.success) {
            revalidatePath("/dashboard/saved-roommates");
            return { success: true, data: response.data, message: response.message };
        }
        return { success: false, message: response.message || "Failed to toggle saved roommate" };
    } catch (error: any) {
        return { success: false, message: error.message || "Toggle saved roommate failed" };
    }
};

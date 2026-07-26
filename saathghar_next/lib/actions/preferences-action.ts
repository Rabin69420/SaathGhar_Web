"use server";

import { getPreferences, updatePreferences, resetPreferences } from "../api/preferences";
import { revalidatePath } from "next/cache";

export const handleGetPreferences = async () => {
    try {
        const response = await getPreferences();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch preferences" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch preferences failed" };
    }
};

export const handleUpdatePreferences = async (data: Record<string, any>) => {
    try {
        const response = await updatePreferences(data);
        if (response.success) {
            revalidatePath("/user/preferences");
            return { success: true, data: response.data, message: "Preferences updated successfully" };
        }
        return { success: false, message: response.message || "Failed to update preferences" };
    } catch (error: any) {
        return { success: false, message: error.message || "Update preferences failed" };
    }
};

export const handleResetPreferences = async () => {
    try {
        const response = await resetPreferences();
        if (response.success) {
            revalidatePath("/user/preferences");
            return { success: true, data: response.data, message: "Preferences reset to defaults" };
        }
        return { success: false, message: response.message || "Failed to reset preferences" };
    } catch (error: any) {
        return { success: false, message: error.message || "Reset preferences failed" };
    }
};

"use server";

import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../api/notifications";
import { revalidatePath } from "next/cache";

export const handleGetNotifications = async () => {
    try {
        const response = await getNotifications();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch notifications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch notifications failed" };
    }
};

export const handleGetUnreadCount = async () => {
    try {
        const response = await getUnreadCount();
        if (response.success) {
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to fetch unread count" };
    } catch (error: any) {
        return { success: false, message: error.message || "Fetch unread count failed" };
    }
};

export const handleMarkNotificationRead = async (id: string) => {
    try {
        const response = await markNotificationRead(id);
        if (response.success) {
            revalidatePath("/dashboard/notifications");
            return { success: true };
        }
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export const handleMarkAllNotificationsRead = async () => {
    try {
        const response = await markAllNotificationsRead();
        if (response.success) {
            revalidatePath("/dashboard/notifications");
            return { success: true, message: "All notifications marked as read" };
        }
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export const handleDeleteNotification = async (id: string) => {
    try {
        const response = await deleteNotification(id);
        if (response.success) {
            revalidatePath("/dashboard/notifications");
            return { success: true, message: "Notification deleted" };
        }
        return { success: false, message: response.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getNotifications = async () => {
    try {
        const response = await axiosInstance.get(API.NOTIFICATIONS.BASE);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch notifications");
    }
};

export const getUnreadCount = async () => {
    try {
        const response = await axiosInstance.get(API.NOTIFICATIONS.UNREAD_COUNT);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch unread count");
    }
};

export const markNotificationRead = async (id: string) => {
    try {
        const response = await axiosInstance.put(API.NOTIFICATIONS.MARK_READ(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to mark as read");
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const response = await axiosInstance.put(API.NOTIFICATIONS.MARK_ALL_READ);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to mark all as read");
    }
};

export const deleteNotification = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.NOTIFICATIONS.DETAIL(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to delete notification");
    }
};

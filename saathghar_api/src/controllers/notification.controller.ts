import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";

const notificationService = new NotificationService();

export class NotificationController {
    async getNotifications(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            const notifications = await notificationService.getNotifications(userId);
            return ApiResponseHelper.success(res, notifications, "Notifications fetched");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getUnreadCount(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            const count = await notificationService.getUnreadCount(userId);
            return ApiResponseHelper.success(res, { count }, "Unread count fetched");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            const notification = await notificationService.markAsRead(req.params.id, userId);
            return ApiResponseHelper.success(res, notification, "Notification marked as read");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            await notificationService.markAllAsRead(userId);
            return ApiResponseHelper.success(res, null, "All notifications marked as read");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteNotification(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            await notificationService.deleteNotification(req.params.id, userId);
            return ApiResponseHelper.success(res, null, "Notification deleted");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}

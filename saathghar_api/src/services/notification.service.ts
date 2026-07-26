import { NotificationRepository } from "../repositories/notification.repository";

const notificationRepo = new NotificationRepository();

export class NotificationService {
    async createNotification(data: { recipient: string; type: string; title: string; message: string; relatedId?: string }) {
        return notificationRepo.create(data);
    }

    async getNotifications(userId: string) {
        return notificationRepo.findByRecipient(userId);
    }

    async getUnreadCount(userId: string) {
        return notificationRepo.countUnread(userId);
    }

    async markAsRead(id: string, userId: string) {
        const notification = await notificationRepo.markAsRead(id, userId);
        if (!notification) {
            throw { message: "Notification not found", status: 404 };
        }
        return notification;
    }

    async markAllAsRead(userId: string) {
        return notificationRepo.markAllAsRead(userId);
    }

    async deleteNotification(id: string, userId: string) {
        const notification = await notificationRepo.delete(id, userId);
        if (!notification) {
            throw { message: "Notification not found", status: 404 };
        }
        return notification;
    }
}

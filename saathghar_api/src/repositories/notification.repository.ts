import { Notification, INotification } from "../models/notification.model";

export class NotificationRepository {
    async create(data: Partial<INotification>) {
        return Notification.create(data);
    }

    async findByRecipient(recipientId: string) {
        return Notification.find({ recipient: recipientId }).sort({ createdAt: -1 }).limit(50);
    }

    async countUnread(recipientId: string) {
        return Notification.countDocuments({ recipient: recipientId, read: false });
    }

    async markAsRead(id: string, recipientId: string) {
        return Notification.findOneAndUpdate(
            { _id: id, recipient: recipientId },
            { read: true },
            { new: true }
        );
    }

    async markAllAsRead(recipientId: string) {
        return Notification.updateMany(
            { recipient: recipientId, read: false },
            { read: true }
        );
    }

    async delete(id: string, recipientId: string) {
        return Notification.findOneAndDelete({ _id: id, recipient: recipientId });
    }
}

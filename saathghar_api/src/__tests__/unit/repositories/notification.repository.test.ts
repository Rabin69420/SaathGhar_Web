import { describe, test, expect, beforeEach } from "bun:test";
import { NotificationRepository } from "../../../repositories/notification.repository";
import { Notification } from "../../../models/notification.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

describe("Unit: NotificationRepository", () => {
    let notificationRepository: NotificationRepository;
    let userId: string;

    beforeEach(async () => {
        notificationRepository = new NotificationRepository();
        const user = await UserModel.create({
            fullName: "Notif User", firstName: "Notif", lastName: "User", email: `notif-${Date.now()}@test.com`, username: `notifuser${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        userId = user._id.toString();
    }, 30000);

    test("should create a notification", async () => {
        const notif = await notificationRepository.create({
            recipient: new mongoose.Types.ObjectId(userId),
            type: "system",
            title: "Welcome",
            message: "Welcome to SaathGhar"
        } as any);
        expect(notif).toBeDefined();
        expect(notif.title).toBe("Welcome");
    }, 30000);

    test("should count unread notifications", async () => {
        await notificationRepository.create({
            recipient: new mongoose.Types.ObjectId(userId),
            type: "system", title: "T1", message: "M1"
        } as any);
        const count = await notificationRepository.countUnread(userId);
        expect(count).toBe(1);
    }, 30000);

    test("should mark notification as read", async () => {
        const notif = await notificationRepository.create({
            recipient: new mongoose.Types.ObjectId(userId),
            type: "system", title: "T1", message: "M1"
        } as any);
        const updated = await notificationRepository.markAsRead(notif._id.toString(), userId);
        expect(updated?.read).toBe(true);
    }, 30000);

    test("should delete a notification", async () => {
        const notif = await notificationRepository.create({
            recipient: new mongoose.Types.ObjectId(userId),
            type: "system", title: "T1", message: "M1"
        } as any);
        const deleted = await notificationRepository.delete(notif._id.toString(), userId);
        expect(deleted).toBeDefined();
    }, 30000);
});

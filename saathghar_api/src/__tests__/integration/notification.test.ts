import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { Notification } from "../../models/notification.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: Notification Routes", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "Notif User", firstName: "Notif", lastName: "U", email: `n-${Date.now()}@test.com`, username: `n${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);
    }, 30000);

    describe("GET /api/v1/notifications", () => {
        test("should return user notifications", async () => {
            await Notification.create({
                recipient: userId,
                type: "system",
                title: "Test",
                message: "Test Message"
            });
            
            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Authorization", `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
        }, 30000);
    });
});

import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: User Routes", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "User Tester",
            firstName: "User",
            lastName: "Tester",
            email: `user-${Date.now()}@test.com`,
            username: `usertester${Date.now()}`,
            password: "password123",
            phoneNumber: "9876543210",
            role: "user",
            preferences: {
                cleanliness: "High",
                noiseLevel: "Moderate",
                sleepSchedule: "Flexible",
                diet: "No preference",
                smoking: "Non-smoker",
                pets: "Pet friendly",
                guests: "Occasionally",
                additionalInfo: ""
            }
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);
    }, 30000);

    test("GET /api/v1/auth/whoami > should return current logged in user details", async () => {
        const res = await request(app)
            .get("/api/v1/auth/whoami")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBeDefined();
    }, 30000);

    test("GET /api/v1/auth/whoami > should fail if token is missing", async () => {
        const res = await request(app)
            .get("/api/v1/auth/whoami");
        
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    }, 30000);

    test("PUT /api/v1/auth/update > should update user profile successfully", async () => {
        const res = await request(app)
            .put("/api/v1/auth/update")
            .set("Authorization", `Bearer ${token}`)
            .send({
                fullName: "Updated User Tester",
                phoneNumber: "9999999999"
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fullName).toBe("Updated User Tester");
    }, 30000);

    test("GET /api/v1/auth/preferences > should get user preferences", async () => {
        const res = await request(app)
            .get("/api/v1/auth/preferences")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.cleanliness).toBe("High");
    }, 30000);

    test("PUT /api/v1/auth/preferences > should update user preferences successfully", async () => {
        const res = await request(app)
            .put("/api/v1/auth/preferences")
            .set("Authorization", `Bearer ${token}`)
            .send({
                cleanliness: "Low",
                noiseLevel: "Loud"
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.cleanliness).toBe("Low");
    }, 30000);

    test("DELETE /api/v1/auth/preferences > should reset user preferences successfully", async () => {
        const res = await request(app)
            .delete("/api/v1/auth/preferences")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.cleanliness).toBe("Medium"); // Default after reset is Medium
    }, 30000);

    test("GET /api/v1/auth/saved-roommates > should get saved roommates list", async () => {
        const res = await request(app)
            .get("/api/v1/auth/saved-roommates")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    }, 30000);

    test("POST /api/v1/auth/saved-roommates/:roommateId > should toggle saving a roommate", async () => {
        const otherUser = await UserModel.create({
            fullName: "Other Tester",
            firstName: "Other",
            lastName: "Tester",
            email: `other-${Date.now()}@test.com`,
            username: `othertester${Date.now()}`,
            password: "password123",
            phoneNumber: "9876543212",
            role: "user"
        });

        const res = await request(app)
            .post(`/api/v1/auth/saved-roommates/${otherUser._id}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    }, 30000);
});

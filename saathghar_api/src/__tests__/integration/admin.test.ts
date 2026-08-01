import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ItemModel } from "../../models/item.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: Admin Routes", () => {
    let adminToken: string;
    let userToken: string;

    beforeEach(async () => {
        const admin = await UserModel.create({
            fullName: "Admin User", firstName: "Admin", lastName: "User", email: `admin-${Date.now()}@test.com`, username: `adminuser${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "admin"
        });
        adminToken = jwt.sign({ id: admin._id, role: "admin" }, SECRET_KEY);

        const user = await UserModel.create({
            fullName: "Normal User", firstName: "Normal", lastName: "User", email: `user-${Date.now()}@test.com`, username: `normaluser${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "user"
        });
        userToken = jwt.sign({ id: user._id, role: "user" }, SECRET_KEY);
    }, 30000);

    describe("GET /api/v1/admin/stats", () => {
        test("should return stats for admin", async () => {
            const res = await request(app)
                .get("/api/v1/admin/stats")
                .set("Authorization", `Bearer ${adminToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);

        test("should deny access to non-admin", async () => {
            const res = await request(app)
                .get("/api/v1/admin/stats")
                .set("Authorization", `Bearer ${userToken}`);
            
            expect(res.statusCode).toBe(403);
        }, 30000);
    });
});

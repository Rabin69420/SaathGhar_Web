import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: KYC Routes", () => {
    let token: string;
    let adminToken: string;
    let userId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "KYC User", firstName: "KYC", lastName: "U", email: `kyc-${Date.now()}@test.com`, username: `kyc${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);

        const admin = await UserModel.create({
            fullName: "Admin User", firstName: "Admin", lastName: "U", email: `admin-${Date.now()}@kyc.com`, username: `admin${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "admin"
        });
        adminToken = jwt.sign({ id: admin._id, role: "admin" }, SECRET_KEY);
    }, 30000);

    describe("GET /api/v1/kyc/status", () => {
        test("should return KYC status for user", async () => {
            const res = await request(app)
                .get("/api/v1/kyc/status")
                .set("Authorization", `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });
});

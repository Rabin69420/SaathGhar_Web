import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { ItemModel } from "../../models/item.model";
import { UserModel } from "../../models/user.model";
import { ApplicationModel } from "../../models/application.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: Application Routes", () => {
    let token: string;
    let adminToken: string;
    let userId: string;
    let listingId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "App Tester", firstName: "App", lastName: "Tester", email: `app-${Date.now()}@test.com`, username: `apptester${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user", kycStatus: "verified"
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);

        const admin = await UserModel.create({
            fullName: "Admin Tester", firstName: "Admin", lastName: "Tester", email: `admin-${Date.now()}@test.com`, username: `admintester${Date.now()}`, password: "password123", phoneNumber: "9876543212", role: "admin"
        });
        adminToken = jwt.sign({ id: admin._id.toString(), role: "admin" }, SECRET_KEY);

        const owner = await UserModel.create({
            fullName: "Owner User", firstName: "Owner", lastName: "User", email: `owner-${Date.now()}@test.com`, username: `owneruser${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "user"
        });
        const item = await ItemModel.create({
            title: "Test Room", description: "Desc", rent: 1000, location: "Loc", image: "img.jpg", owner: owner._id
        });
        listingId = item._id.toString();
    }, 30000);

    describe("POST /api/v1/applications", () => {
        test("should submit a new application", async () => {
            const res = await request(app)
                .post("/api/v1/applications")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    listing: listingId,
                    message: "I am interested"
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });

    describe("GET /api/v1/applications/my-applications", () => {
        test("should return user's applications", async () => {
            await ApplicationModel.create({
                listing: listingId,
                applicant: userId,
                message: "My App"
            });
            
            const res = await request(app)
                .get("/api/v1/applications/my-applications")
                .set("Authorization", `Bearer ${token}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
        }, 30000);
    });

    describe("GET /api/v1/applications/:id", () => {
        test("should return an application by ID", async () => {
            const appObj = await ApplicationModel.create({
                listing: listingId,
                applicant: userId,
                message: "My App ID"
            });
            const res = await request(app)
                .get(`/api/v1/applications/${appObj._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.message).toBe("My App ID");
        }, 30000);

        test("should return 404 for non-existent application ID", async () => {
            const res = await request(app)
                .get("/api/v1/applications/507f1f77bcf86cd799439011")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        }, 30000);
    });

    describe("PUT /api/v1/applications/:id/status", () => {
        test("should update application status successfully", async () => {
            const appObj = await ApplicationModel.create({
                listing: listingId,
                applicant: userId,
                message: "Status change"
            });
            const res = await request(app)
                .put(`/api/v1/applications/${appObj._id}/status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "approved" });
            expect(res.statusCode).toBe(200);
            expect(res.body.data.status).toBe("approved");
        }, 30000);
    });

    describe("DELETE /api/v1/applications/:id", () => {
        test("should delete application successfully", async () => {
            const appObj = await ApplicationModel.create({
                listing: listingId,
                applicant: userId,
                message: "Delete me"
            });
            const res = await request(app)
                .delete(`/api/v1/applications/${appObj._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });
});

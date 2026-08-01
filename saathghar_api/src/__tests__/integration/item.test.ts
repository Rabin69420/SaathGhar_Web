import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { ItemModel } from "../../models/item.model";
import { UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: Item Routes", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "Item Tester", firstName: "Item", lastName: "Tester", email: `item-${Date.now()}@test.com`, username: `itemtester${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user", kycStatus: "verified"
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);
    }, 30000);

    const itemData = {
        title: "Integration Test Room",
        description: "This is a long enough description for testing",
        rent: 1000,
        location: "Loc",
        image: "img.jpg"
    };

    describe("POST /api/v1/items", () => {
        test("should create a new item", async () => {
            const res = await request(app)
                .post("/api/v1/items")
                .set("Authorization", `Bearer ${token}`)
                .send(itemData);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });

    describe("GET /api/v1/items", () => {
        test("should return all items", async () => {
            await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app).get("/api/v1/items");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        }, 30000);
    });

    describe("GET /api/v1/items/:id", () => {
        test("should return a single item", async () => {
            const item = await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app).get(`/api/v1/items/${item._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe(itemData.title);
        }, 30000);

        test("should return 404 for non-existent item ID", async () => {
            const res = await request(app).get("/api/v1/items/507f1f77bcf86cd799439011");
            expect(res.statusCode).toBe(404);
        }, 30000);
    });

    describe("POST /api/v1/items - Security & Validation", () => {
        test("should fail to create item if unauthorized", async () => {
            const res = await request(app)
                .post("/api/v1/items")
                .send(itemData);
            expect(res.statusCode).toBe(401);
        }, 30000);
    });

    describe("PUT /api/v1/items/:id", () => {
        test("should update item details successfully", async () => {
            const item = await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app)
                .put(`/api/v1/items/${item._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Completely New Title", rent: 6000 });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe("Completely New Title");
            expect(res.body.data.rent).toBe(6000);
        }, 30000);
    });

    describe("DELETE /api/v1/items/:id", () => {
        test("should delete item successfully", async () => {
            const item = await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app)
                .delete(`/api/v1/items/${item._id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });

    describe("POST /api/v1/items/:id/bookmark", () => {
        test("should toggle bookmark successfully", async () => {
            const item = await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app)
                .post(`/api/v1/items/${item._id}/bookmark`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });

    describe("GET /api/v1/items/my-listings", () => {
        test("should return user's listings", async () => {
            await ItemModel.create({ ...itemData, owner: userId });
            const res = await request(app)
                .get("/api/v1/items/my-listings")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        }, 30000);
    });
});

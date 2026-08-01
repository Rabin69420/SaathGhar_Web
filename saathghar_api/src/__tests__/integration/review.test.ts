import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ReviewModel } from "../../models/review.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

describe("Integration: Review Routes", () => {
    let token: string;
    let userId: string;
    let revieweeId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            fullName: "Reviewer User", firstName: "Reviewer", lastName: "U", email: `rev-${Date.now()}@test.com`, username: `rev${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        userId = user._id.toString();
        token = jwt.sign({ id: userId, role: "user" }, SECRET_KEY);

        const reviewee = await UserModel.create({
            fullName: "Reviewee User", firstName: "Reviewee", lastName: "U", email: `ee-${Date.now()}@test.com`, username: `ee${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "user"
        });
        revieweeId = reviewee._id.toString();
    }, 30000);

    describe("POST /api/v1/reviews", () => {
        test("should create a review", async () => {
            const res = await request(app)
                .post("/api/v1/reviews")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    reviewee: revieweeId,
                    rating: 5,
                    comment: "Excellent work"
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        }, 30000);
    });
});

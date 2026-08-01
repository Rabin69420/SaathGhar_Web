import { describe, test, expect, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Integration: Auth Routes", () => {
    const userData = {
        fullName: "Auth Test",
        firstName: "Auth",
        lastName: "Test",
        email: "auth@test.com",
        username: "authtest123",
        password: "password123",
        phoneNumber: "9876543210",
        role: "user" as const
    };

    describe("POST /api/v1/auth/register", () => {
        test("should register a new user", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(userData);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(userData.email);
        }, 30000);

        test("should not register user with existing email", async () => {
            await UserModel.create(userData);
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(userData);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        }, 30000);
    });

    describe("POST /api/v1/auth/login", () => {
        beforeEach(async () => {
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            await UserModel.create({ ...userData, password: hashedPassword });
        }, 30000);

        test("should login successfully", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: userData.email,
                    password: userData.password
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        }, 30000);

        test("should fail with incorrect password", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: userData.email,
                    password: "wrongpassword"
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        }, 30000);

        test("should fail login with non-existent email", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "notfound@test.com",
                    password: userData.password
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        }, 30000);

        test("should fail login with missing fields", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: userData.email
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        }, 30000);
    });

    describe("POST /api/v1/auth/register - Validation Edge Cases", () => {
        test("should fail registration with invalid email format", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ ...userData, email: "invalid-email" });
            expect(res.statusCode).toBe(400);
        }, 30000);

        test("should fail registration with missing fields", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ email: "onlyemail@test.com" });
            expect(res.statusCode).toBe(400);
        }, 30000);
    });
});

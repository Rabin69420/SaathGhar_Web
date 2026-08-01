import { describe, test, expect, beforeEach } from "bun:test";
import { UserMongoRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.model";

describe("Unit: UserMongoRepository", () => {
    let userRepository: UserMongoRepository;

    beforeEach(() => {
        userRepository = new UserMongoRepository();
    });

    const userData = {
        fullName: "Test User",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        username: "testuser123",
        password: "password123",
        phoneNumber: "9876543210",
        role: "user" as const
    };

    test("should create a user", async () => {
        const user = await userRepository.createUser(userData);
        expect(user).toBeDefined();
        expect(user.email).toBe(userData.email);
        expect(user.username).toBe(userData.username);
    }, 30000);

    test("should find a user by email", async () => {
        await userRepository.createUser(userData);
        const found = await userRepository.getUserByEmail(userData.email);
        expect(found).toBeDefined();
        expect(found?.email).toBe(userData.email);
    }, 30000);

    test("should find a user by username", async () => {
        await userRepository.createUser(userData);
        const found = await userRepository.getUserByUsername(userData.username);
        expect(found).toBeDefined();
        expect(found?.username).toBe(userData.username);
    }, 30000);

    test("should find a user by id", async () => {
        const created = await userRepository.createUser(userData);
        const found = await userRepository.getUserById(created._id.toString());
        expect(found).toBeDefined();
        expect(found?._id.toString()).toBe(created._id.toString());
    }, 30000);

    test("should update a user", async () => {
        const created = await userRepository.createUser(userData);
        const updated = await userRepository.update(created._id.toString(), { firstName: "Updated" });
        expect(updated?.firstName).toBe("Updated");
    }, 30000);

    test("should delete a user", async () => {
        const created = await userRepository.createUser(userData);
        const deleted = await userRepository.delete(created._id.toString());
        expect(deleted).toBe(true);
        const found = await userRepository.getUserById(created._id.toString());
        expect(found).toBeNull();
    }, 30000);

    test("should get all users", async () => {
        await userRepository.createUser(userData);
        await userRepository.createUser({ ...userData, email: "test2@example.com", username: "testuser456" });
        const all = await userRepository.getAll();
        expect(all.length).toBe(2);
    }, 30000);

    test("should return null for non-existent user by ID", async () => {
        const nonExistentId = "507f1f77bcf86cd799439011";
        const found = await userRepository.getUserById(nonExistentId);
        expect(found).toBeNull();
    }, 30000);

    test("should return null for non-existent user by email", async () => {
        const found = await userRepository.getUserByEmail("notfound@example.com");
        expect(found).toBeNull();
    }, 30000);

    test("should fail to create user with duplicate email", async () => {
        await UserModel.init();
        await userRepository.createUser(userData);
        let thrownError: any = null;
        try {
            await userRepository.createUser(userData);
        } catch (err) {
            thrownError = err;
        }
        expect(thrownError).toBeDefined();
        expect(thrownError?.code).toBe(11000); // MongoDB duplicate key error code
    }, 30000);
});

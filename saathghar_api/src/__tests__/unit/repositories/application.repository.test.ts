import { describe, test, expect, beforeEach } from "bun:test";
import { ApplicationMongoRepository } from "../../../repositories/application.repository";
import { ApplicationModel } from "../../../models/application.model";
import { ItemModel } from "../../../models/item.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

describe("Unit: ApplicationMongoRepository", () => {
    let applicationRepository: ApplicationMongoRepository;
    let applicantId: string;
    let listingId: string;

    beforeEach(async () => {
        applicationRepository = new ApplicationMongoRepository();
        
        const owner = await UserModel.create({
            fullName: "Owner User", firstName: "Owner", lastName: "User", email: `owner-${Date.now()}@app.com`, username: `ownerapp${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        
        const applicant = await UserModel.create({
            fullName: "Applicant User", firstName: "Applicant", lastName: "User", email: `applicant-${Date.now()}@app.com`, username: `applicantapp${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "user"
        });
        applicantId = applicant._id.toString();

        const item = await ItemModel.create({
            title: "App Room", description: "Desc", rent: 1000, location: "Loc", image: "img.jpg", owner: owner._id
        });
        listingId = item._id.toString();
    }, 30000);

    test("should create an application", async () => {
        const app = await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        expect(app).toBeDefined();
        expect(app.message).toBe("I want this room");
    }, 30000);

    test("should find application by id", async () => {
        const created = await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        const found = await applicationRepository.findById(created._id.toString());
        expect(found).toBeDefined();
        expect(found?.message).toBe("I want this room");
    }, 30000);

    test("should update application status", async () => {
        const created = await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        const updated = await applicationRepository.updateStatus(created._id.toString(), "approved");
        expect(updated?.status).toBe("approved");
    }, 30000);

    test("should delete an application", async () => {
        const created = await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        const deleted = await applicationRepository.delete(created._id.toString());
        expect(deleted).toBe(true);
    }, 30000);

    test("should find applications by listing ID", async () => {
        await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        const apps = await applicationRepository.findByListing(listingId);
        expect(apps.length).toBe(1);
        expect(apps[0]?.message).toBe("I want this room");
    }, 30000);

    test("should find applications by applicant ID", async () => {
        await applicationRepository.create({
            listing: new mongoose.Types.ObjectId(listingId),
            applicant: new mongoose.Types.ObjectId(applicantId),
            message: "I want this room"
        } as any);
        const apps = await applicationRepository.findByApplicant(applicantId);
        expect(apps.length).toBe(1);
        expect(apps[0]?.message).toBe("I want this room");
    }, 30000);

    test("should return null for non-existent application ID", async () => {
        const nonExistentId = "507f1f77bcf86cd799439011";
        const found = await applicationRepository.findById(nonExistentId);
        expect(found).toBeNull();
    }, 30000);
});

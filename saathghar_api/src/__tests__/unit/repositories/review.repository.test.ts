import { describe, test, expect, beforeEach } from "bun:test";
import { ReviewMongoRepository } from "../../../repositories/review.repository";
import { ReviewModel } from "../../../models/review.model";
import { UserModel } from "../../../models/user.model";
import { ItemModel } from "../../../models/item.model";
import mongoose from "mongoose";

describe("Unit: ReviewMongoRepository", () => {
    let reviewRepository: ReviewMongoRepository;
    let reviewerId: string;
    let revieweeId: string;
    let listingId: string;

    beforeEach(async () => {
        reviewRepository = new ReviewMongoRepository();
        
        const reviewer = await UserModel.create({
            fullName: "Reviewer User", firstName: "Reviewer", lastName: "User", email: `rev1-${Date.now()}@test.com`, username: `rev1${Date.now()}`, password: "password123", phoneNumber: "9876543210", role: "user"
        });
        reviewerId = reviewer._id.toString();

        const reviewee = await UserModel.create({
            fullName: "Reviewee User", firstName: "Reviewee", lastName: "User", email: `rev2-${Date.now()}@test.com`, username: `rev2${Date.now()}`, password: "password123", phoneNumber: "9876543211", role: "user"
        });
        revieweeId = reviewee._id.toString();

        const item = await ItemModel.create({
            title: "Rev Room", description: "Desc", rent: 1000, location: "Loc", image: "img.jpg", owner: reviewee._id
        });
        listingId = item._id.toString();
    }, 30000);

    test("should create a review", async () => {
        const review = await reviewRepository.create({
            reviewer: new mongoose.Types.ObjectId(reviewerId),
            reviewee: new mongoose.Types.ObjectId(revieweeId),
            listing: new mongoose.Types.ObjectId(listingId),
            rating: 5,
            comment: "Great experience"
        } as any);
        expect(review).toBeDefined();
        expect(review.rating).toBe(5);
    }, 30000);

    test("should find review by id", async () => {
        const created = await reviewRepository.create({
            reviewer: new mongoose.Types.ObjectId(reviewerId),
            reviewee: new mongoose.Types.ObjectId(revieweeId),
            listing: new mongoose.Types.ObjectId(listingId),
            rating: 4,
            comment: "Good"
        } as any);
        const found = await reviewRepository.findById(created._id.toString());
        expect(found).toBeDefined();
        expect(found?.rating).toBe(4);
    }, 30000);

    test("should update a review", async () => {
        const created = await reviewRepository.create({
            reviewer: new mongoose.Types.ObjectId(reviewerId),
            reviewee: new mongoose.Types.ObjectId(revieweeId),
            listing: new mongoose.Types.ObjectId(listingId),
            rating: 5, comment: "X"
        } as any);
        const updated = await reviewRepository.update(created._id.toString(), { rating: 1 });
        expect(updated?.rating).toBe(1);
    }, 30000);

    test("should delete a review", async () => {
        const created = await reviewRepository.create({
            reviewer: new mongoose.Types.ObjectId(reviewerId),
            reviewee: new mongoose.Types.ObjectId(revieweeId),
            listing: new mongoose.Types.ObjectId(listingId),
            rating: 5, comment: "X"
        } as any);
        const deleted = await reviewRepository.delete(created._id.toString());
        expect(deleted).toBe(true);
    }, 30000);
});

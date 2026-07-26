import { ReviewModel, IReview } from "../models/review.model";

export interface IReviewRepository {
    create(data: Partial<IReview>): Promise<IReview>;
    findById(id: string): Promise<IReview | null>;
    findByReviewee(revieweeId: string): Promise<IReview[]>;
    findByReviewer(reviewerId: string): Promise<IReview[]>;
    findByListing(listingId: string): Promise<IReview[]>;
    update(id: string, data: Partial<IReview>): Promise<IReview | null>;
    delete(id: string): Promise<boolean>;
}

export class ReviewMongoRepository implements IReviewRepository {
    async create(data: Partial<IReview>): Promise<IReview> {
        const created = await ReviewModel.create(data);
        return created.populate([
            { path: "reviewer", select: "fullName username imageUrl" },
            { path: "reviewee", select: "fullName username imageUrl" },
            { path: "listing", select: "title location" }
        ]);
    }

    async findById(id: string): Promise<IReview | null> {
        return ReviewModel.findById(id)
            .populate("reviewer", "fullName username imageUrl")
            .populate("reviewee", "fullName username imageUrl")
            .populate("listing", "title location");
    }

    async findByReviewee(revieweeId: string): Promise<IReview[]> {
        return ReviewModel.find({ reviewee: revieweeId })
            .populate("reviewer", "fullName username imageUrl")
            .populate("listing", "title location")
            .sort({ createdAt: -1 });
    }

    async findByReviewer(reviewerId: string): Promise<IReview[]> {
        return ReviewModel.find({ reviewer: reviewerId })
            .populate("reviewee", "fullName username imageUrl")
            .populate("listing", "title location")
            .sort({ createdAt: -1 });
    }

    async findByListing(listingId: string): Promise<IReview[]> {
        return ReviewModel.find({ listing: listingId })
            .populate("reviewer", "fullName username imageUrl")
            .populate("reviewee", "fullName username imageUrl")
            .sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<IReview>): Promise<IReview | null> {
        return ReviewModel.findByIdAndUpdate(id, data, { new: true })
            .populate("reviewer", "fullName username imageUrl")
            .populate("reviewee", "fullName username imageUrl")
            .populate("listing", "title location");
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await ReviewModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async findAll(): Promise<IReview[]> {
        return ReviewModel.find()
            .populate("reviewer", "fullName username")
            .populate("reviewee", "fullName username")
            .populate("listing", "title")
            .sort({ createdAt: -1 });
    }
}

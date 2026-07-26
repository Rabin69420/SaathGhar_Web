import mongoose, { Schema } from "mongoose";
import { ReviewTypes } from "../types/review.types";

export interface IReview extends Omit<ReviewTypes, "reviewer" | "reviewee" | "listing">, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    reviewee: mongoose.Types.ObjectId;
    listing?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewMongoSchema = new Schema<IReview>(
    {
        reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reviewee: { type: Schema.Types.ObjectId, ref: "User", required: true },
        listing: { type: Schema.Types.ObjectId, ref: "Item" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

ReviewMongoSchema.index({ reviewer: 1, reviewee: 1, listing: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReview>("Review", ReviewMongoSchema);

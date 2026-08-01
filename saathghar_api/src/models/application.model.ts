import mongoose, { Schema } from "mongoose";
import { ApplicationTypes } from "../types/application.types";

export interface IApplication extends Omit<ApplicationTypes, "listing" | "applicant">, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    listing: mongoose.Types.ObjectId;
    applicant: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationMongoSchema = new Schema<IApplication>(
    {
        listing: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ["pending", "approved", "accepted", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

ApplicationMongoSchema.index({ listing: 1, applicant: 1 }, { unique: true });

export const ApplicationModel = mongoose.model<IApplication>("Application", ApplicationMongoSchema);

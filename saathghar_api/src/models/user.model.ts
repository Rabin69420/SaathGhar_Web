import mongoose, { Schema, Document } from "mongoose";
import { UserTypes } from "../types/user.types";

export interface IUser extends UserTypes, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    bookmarks?: mongoose.Types.ObjectId[];
    savedRoommates?: mongoose.Types.ObjectId[];
    kycStatus: "unverified" | "pending" | "verified" | "rejected";
    kycDocuments?: { type: "front" | "back"; filename: string; uploadedAt: Date }[];
    kycRejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserMongoSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        firstName: { type: String },
        lastName: { type: String },
        imageUrl: { type: String },
        bookmarks: [{ type: Schema.Types.ObjectId, ref: "Item", default: [] }],
        savedRoommates: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
        kycStatus: { type: String, enum: ["unverified", "pending", "verified", "rejected"], default: "unverified" },
        kycDocuments: [{
            type: { type: String, enum: ["front", "back"] },
            filename: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }],
        kycRejectionReason: { type: String },
        preferences: {
            preferredLocation: { type: String, default: "" },
            maxRent: { type: Number },
            propertyType: { type: String, default: "" },
            cleanliness: { type: String, default: "" },
            noiseLevel: { type: String, default: "" },
            sleepSchedule: { type: String, default: "" },
            diet: { type: String, default: "" },
            smoking: { type: String, default: "" },
            pets: { type: String, default: "" },
            guests: { type: String, default: "" },
            additionalInfo: { type: String, default: "" }
        }
    },
    {
        timestamps: true
    }
);

// Pre-save hook to automatically derive fullName from firstName & lastName if they are present
UserMongoSchema.pre("save", async function (this: any) {
    if (this.firstName || this.lastName) {
        this.fullName = `${this.firstName || ""} ${this.lastName || ""}`.trim() || this.fullName;
    } else if (this.fullName) {
        // If registered with fullName, populate firstName and lastName as best effort
        const parts = this.fullName.split(" ");
        if (parts.length > 0 && !this.firstName) {
            this.firstName = parts[0];
            this.lastName = parts.slice(1).join(" ") || "";
        }
    }
});

export const UserModel = mongoose.model<IUser>(
    "User",
    UserMongoSchema
);
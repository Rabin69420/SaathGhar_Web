import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    type: "application_received" | "application_approved" | "application_accepted" | "application_rejected" | "review_received" | "kyc_approved" | "kyc_rejected" | "system";
    title: string;
    message: string;
    relatedId?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        type: {
            type: String,
            enum: ["application_received", "application_approved", "application_accepted", "application_rejected", "review_received", "kyc_approved", "kyc_rejected", "system"],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        relatedId: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

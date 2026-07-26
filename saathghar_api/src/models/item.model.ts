import mongoose, { Schema, Document } from "mongoose";
import { ItemTypes } from "../types/item.types";

export interface IItem extends Omit<ItemTypes, "owner">, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ItemMongoSchema: Schema = new Schema<IItem>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        rent: { type: Number, required: true },
        location: { type: String, required: true },
        image: { type: String, required: true },
        video: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
);

export const ItemModel = mongoose.model<IItem>("Item", ItemMongoSchema);

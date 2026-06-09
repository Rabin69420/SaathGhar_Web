import mongoose, { Schema, Document } from "mongoose";
import { UserTypes } from "../types/user.types";

export interface IUser extends UserTypes, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserMongoSchema: Schema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" }
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.model<IUser>(
    "User",
    UserMongoSchema
);
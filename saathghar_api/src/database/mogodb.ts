import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected To MongoDB Successfully");
    } catch (error) {
        console.error("Error Connecting To MongoDB:", error);
        throw error; 
    }
}

export default connectMongoDB;
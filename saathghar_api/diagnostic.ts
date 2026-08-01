import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from './src/models/user.model';

async function run() {
    console.log("Starting diagnostic...");
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    console.log("Connecting to:", uri);
    
    try {
        await mongoose.connect(uri);
        console.log("Connected!");
        
        console.log("Attempting to create user...");
        const user = await UserModel.create({
            fullName: "Diagnostic User",
            firstName: "Diag",
            lastName: "User",
            email: "diag@test.com",
            username: "diaguser123",
            password: "password123",
            phoneNumber: "9876543210",
            role: "user"
        });
        console.log("User created:", user._id);
        
        const found = await UserModel.findOne({ email: "diag@test.com" });
        console.log("User found:", found?.fullName);
        
    } catch (err) {
        console.error("Error during diagnostic:", err);
    } finally {
        await mongoose.disconnect();
        await mongo.stop();
        console.log("Diagnostic complete.");
        process.exit(0);
    }
}

run();

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from './src/models/user.model';

async function run() {
    console.log("Starting diagnostic V2...");
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    console.log("Connecting to:", uri);
    
    try {
        await mongoose.connect(uri);
        console.log("Connected! State:", mongoose.connection.readyState);
        
        console.log("Mongoose models:", Object.keys(mongoose.models));
        
        console.log("Attempting to create user...");
        const userPromise = UserModel.create({
            fullName: "Diagnostic User",
            firstName: "Diag",
            lastName: "User",
            email: "diag@test.com",
            username: "diaguser123",
            password: "password123",
            phoneNumber: "9876543210",
            role: "user"
        });
        
        // Wait and check connection state
        setTimeout(() => {
            console.log("Connection state after 1s:", mongoose.connection.readyState);
        }, 1000);
        
        const user = await userPromise;
        console.log("User created:", user._id);
        
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

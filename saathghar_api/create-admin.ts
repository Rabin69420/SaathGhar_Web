import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { connectMongoDB } from "./src/database/mogodb";
import { UserModel } from "./src/models/user.model";

const createAdmin = async () => {
    try {
        await connectMongoDB();
        
        const adminEmail = "admin@gmail.com";
        const adminUsername = "admin";
        const adminPassword = "admin@123";
        
        const hashedPassword = await bcryptjs.hash(adminPassword, 10);
        
        const existing = await UserModel.findOne({
            $or: [
                { email: adminEmail },
                { username: adminUsername }
            ]
        });
        if (existing) {
            existing.role = "admin";
            existing.password = hashedPassword;
            existing.email = adminEmail;
            existing.username = adminUsername;
            await existing.save();
            console.log("=========================================");
            console.log("  Admin User Updated Successfully!       ");
            console.log("=========================================");
            console.log(`  Email:    ${adminEmail}`);
            console.log(`  Password: ${adminPassword}`);
            console.log("=========================================");
            process.exit(0);
        }
        
        await UserModel.create({
            fullName: "System Admin",
            email: adminEmail,
            username: adminUsername,
            password: hashedPassword,
            phoneNumber: "9800000000",
            role: "admin",
            firstName: "System",
            lastName: "Admin"
        });
        
        console.log("=========================================");
        console.log("  Admin User Created Successfully!       ");
        console.log("=========================================");
        console.log(`  Email:    ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log("=========================================");
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdmin();

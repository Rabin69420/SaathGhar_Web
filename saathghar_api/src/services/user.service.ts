import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; 
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

export class UserService {
    async createUser(userData: CreateUserDTO): Promise<any> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }
        
        const existingUsername = await userRepository.getUserByUsername(userData.username);
        if (existingUsername) {
            throw new HttpException(400, "Username already exists");
        }
        
        const hashedPassword = await bcryptjs.hash(userData.password, 10); 
        userData.password = hashedPassword;
        
        const user = await userRepository.createUser(userData);
        
        const userObj = user.toObject();
        delete userObj.password;
        
        return userObj;
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email");
        }
        
        const isPasswordValid = await bcryptjs.compare( 
            loginData.password,  
            user.password       
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        
        const userObj = user.toObject();
        delete userObj.password;
        
        return { user: userObj, token };
    }

    async getUserById(id: string): Promise<any> {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    async updateUserProfile(id: string, updateData: Partial<IUser>): Promise<any> {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        if (updateData.email && updateData.email !== user.email) {
            const existingEmail = await userRepository.getUserByEmail(updateData.email);
            if (existingEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }

        if (updateData.username && updateData.username !== user.username) {
            const existingUsername = await userRepository.getUserByUsername(updateData.username);
            if (existingUsername) {
                throw new HttpException(400, "Username already exists");
            }
        }

        const updatedUser = await userRepository.update(id, updateData);
        if (!updatedUser) {
            throw new HttpException(400, "Failed to update profile");
        }

        const userObj = updatedUser.toObject();
        delete userObj.password;
        return userObj;
    }
}
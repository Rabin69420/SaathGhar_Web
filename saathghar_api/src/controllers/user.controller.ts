import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";
import { Request, Response } from "express";
const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.createUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    
    async loginUser(req: Request, res: Response) {
        try{
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(parsedData.error), 400);
            }
            const { user, token } = await userService.loginUser(parsedData.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        }catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async whoamiUser(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userObj = typeof (req.user as any).toObject === 'function' 
                ? (req.user as any).toObject() 
                : { ...req.user };
            delete userObj.password;
            return ApiResponseHelper.success(res, userObj, "User fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userId = (req.user as any)._id.toString();
            const { firstName, lastName, email, username, preferences, phoneNumber } = req.body;
            
            const updateData: any = {};
            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (email !== undefined) updateData.email = email;
            if (username !== undefined) updateData.username = username;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            
            // Keep fullName in sync if firstName or lastName is updated
            if (firstName !== undefined || lastName !== undefined) {
                const currentFirstName = firstName !== undefined ? firstName : (req.user as any).firstName || "";
                const currentLastName = lastName !== undefined ? lastName : (req.user as any).lastName || "";
                updateData.fullName = `${currentFirstName} ${currentLastName}`.trim();
            }
            
            if (preferences !== undefined) {
                try {
                    updateData.preferences = typeof preferences === "string" ? JSON.parse(preferences) : preferences;
                } catch (e) {
                    updateData.preferences = preferences;
                }
            }
            
            if (req.file) {
                updateData.imageUrl = `/uploads/${req.file.filename}`;
            }
            
            const updatedUser = await userService.updateUserProfile(userId, updateData);
            return ApiResponseHelper.success(res, updatedUser, "Profile updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}
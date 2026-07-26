import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { PreferencesDTO } from "../dtos/preferences.dto";
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

    async getPreferences(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userObj = typeof (req.user as any).toObject === 'function'
                ? (req.user as any).toObject()
                : { ...req.user };
            return ApiResponseHelper.success(res, userObj.preferences || {}, "Preferences fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updatePreferences(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const parsed = PreferencesDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const userId = (req.user as any)._id.toString();
            const updatedUser = await userService.updateUserProfile(userId, { preferences: parsed.data });
            return ApiResponseHelper.success(res, updatedUser.preferences, "Preferences updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async resetPreferences(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userId = (req.user as any)._id.toString();
            const defaultPrefs = {
                cleanliness: "Medium",
                noiseLevel: "Moderate",
                sleepSchedule: "Flexible",
                diet: "No preference",
                smoking: "Non-smoker",
                pets: "Pet friendly",
                guests: "Occasionally",
                additionalInfo: "",
            };
            const updatedUser = await userService.updateUserProfile(userId, { preferences: defaultPrefs });
            return ApiResponseHelper.success(res, updatedUser.preferences, "Preferences reset to defaults");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getSavedRoommates(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const user = await userService.getUserById((req.user as any)._id.toString());
            if (!user) return ApiResponseHelper.error(res, "User not found", 404);
            await user.populate("savedRoommates", "fullName username email imageUrl preferences phoneNumber");
            return ApiResponseHelper.success(res, user.savedRoommates || [], "Saved roommates fetched");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async toggleSavedRoommate(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            const roommateId = req.params.roommateId;

            if (userId === roommateId) {
                return ApiResponseHelper.error(res, "You cannot save yourself", 400);
            }

            const user = await userService.getUserById(userId);
            if (!user) return ApiResponseHelper.error(res, "User not found", 404);

            const savedRoommates = user.savedRoommates || [];
            const index = savedRoommates.findIndex((id: any) => id.toString() === roommateId);

            if (index > -1) {
                savedRoommates.splice(index, 1);
            } else {
                savedRoommates.push(roommateId as any);
            }

            const updated = await userService.updateUserProfile(userId, { savedRoommates });
            return ApiResponseHelper.success(res, { saved: index === -1 }, index > -1 ? "Roommate unsaved" : "Roommate saved");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}
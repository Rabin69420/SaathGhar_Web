import { Request, Response } from "express";
import { UserMongoRepository } from "../repositories/user.repository";
import { ItemMongoRepository } from "../repositories/item.repository";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";

const userRepository = new UserMongoRepository();
const itemRepository = new ItemMongoRepository();

export class AdminController {
    async getStats(req: Request, res: Response) {
        try {
            const users = await userRepository.getAll();
            const items = await itemRepository.getAllItems();
            
            const stats = {
                totalUsers: users.length,
                totalListings: items.length,
            };
            
            return ApiResponseHelper.success(res, stats, "Admin statistics fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userRepository.getAll();
            const usersWithoutPasswords = users.map((user) => {
                const userObj = user.toObject();
                delete userObj.password;
                return userObj;
            });
            return ApiResponseHelper.success(res, usersWithoutPasswords, "All users fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            if (!id) {
                return ApiResponseHelper.error(res, "User ID is required", 400);
            }
            
            // Cannot delete yourself
            if ((req.user as any)._id.toString() === id) {
                return ApiResponseHelper.error(res, "You cannot delete your own admin account", 400);
            }

            const success = await userRepository.delete(id);
            if (!success) {
                return ApiResponseHelper.error(res, "User not found or failed to delete", 404);
            }

            return ApiResponseHelper.success(res, null, "User deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
        }
    }

    async getAllListings(req: Request, res: Response) {
        try {
            const items = await itemRepository.getAllItems();
            return ApiResponseHelper.success(res, items, "All listings fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
        }
    }

    async deleteListing(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            if (!id) {
                return ApiResponseHelper.error(res, "Listing ID is required", 400);
            }

            const success = await itemRepository.deleteItem(id);
            if (!success) {
                return ApiResponseHelper.error(res, "Listing not found or failed to delete", 404);
            }

            return ApiResponseHelper.success(res, null, "Listing deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
        }
    }
}

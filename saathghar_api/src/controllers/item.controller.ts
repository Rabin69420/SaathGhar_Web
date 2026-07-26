import { Request, Response } from "express";
import { ItemService } from "../services/item.service";
import { CreateItemDTO, UpdateItemDTO } from "../dtos/item.dto";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";
import { z } from "zod";

const itemService = new ItemService();

export class ItemController {
    async createItem(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            
            const body = { ...req.body };
            if (req.file) {
                body.image = req.file.filename;
            }

            const parsed = CreateItemDTO.safeParse(body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const itemData = parsed.data;
            const item = await itemService.createItem(itemData, (req.user as any)._id.toString());
            return ApiResponseHelper.success(res, item, "Item created successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getItems(req: Request, res: Response) {
        try {
            const items = await itemService.getAllItems();
            return ApiResponseHelper.success(res, items, "Items fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getItem(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const item = await itemService.getItemById(id);
            return ApiResponseHelper.success(res, item, "Item fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateItem(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const body = { ...req.body };
            if (req.file) {
                body.image = req.file.filename;
            }

            const parsed = UpdateItemDTO.safeParse(body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const itemData = parsed.data;
            const userId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const id = req.params.id as string;

            const updated = await itemService.updateItem(id, itemData, userId, isAdmin);
            return ApiResponseHelper.success(res, updated, "Item updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteItem(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const userId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const id = req.params.id as string;

            await itemService.deleteItem(id, userId, isAdmin);
            return ApiResponseHelper.success(res, null, "Item deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyListings(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userId = (req.user as any)._id.toString();
            const items = await itemService.getMyListings(userId);
            return ApiResponseHelper.success(res, items, "My listings fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getBookmarkedListings(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userId = (req.user as any)._id.toString();
            const items = await itemService.getBookmarkedListings(userId);
            return ApiResponseHelper.success(res, items, "Bookmarked listings fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async toggleBookmark(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const userId = (req.user as any)._id.toString();
            const itemId = req.params.id as string;
            const result = await itemService.toggleBookmark(userId, itemId);
            return ApiResponseHelper.success(res, result, result.bookmarked ? "Bookmark added successfully" : "Bookmark removed successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async checkCompatibility(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const seekerId = (req.user as any)._id.toString();
            const itemId = req.params.id as string;
            const { customPreferences } = req.body;

            const result = await itemService.checkCompatibility(itemId, seekerId, customPreferences);
            return ApiResponseHelper.success(res, result, "Compatibility report generated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}

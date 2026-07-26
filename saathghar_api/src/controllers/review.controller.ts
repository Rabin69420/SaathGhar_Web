import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";
import { z } from "zod";

const reviewService = new ReviewService();

export class ReviewController {
    async createReview(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const parsed = CreateReviewDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const reviewerId = (req.user as any)._id.toString();
            const review = await reviewService.createReview(parsed.data, reviewerId);
            return ApiResponseHelper.success(res, review, "Review created successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const reviewerId = (req.user as any)._id.toString();
            const reviews = await reviewService.getMyReviews(reviewerId);
            return ApiResponseHelper.success(res, reviews, "My reviews fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getReviewsForUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            const reviews = await reviewService.getReviewsForUser(userId);
            return ApiResponseHelper.success(res, reviews, "User reviews fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getReviewsForListing(req: Request, res: Response) {
        try {
            const listingId = req.params.listingId as string;
            const reviews = await reviewService.getReviewsForListing(listingId);
            return ApiResponseHelper.success(res, reviews, "Listing reviews fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getReviewById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const review = await reviewService.getReviewById(id);
            return ApiResponseHelper.success(res, review, "Review fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateReview(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const parsed = UpdateReviewDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const id = req.params.id as string;
            const requesterId = (req.user as any)._id.toString();
            const review = await reviewService.updateReview(id, parsed.data, requesterId);
            return ApiResponseHelper.success(res, review, "Review updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const id = req.params.id as string;
            const requesterId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            await reviewService.deleteReview(id, requesterId, isAdmin);
            return ApiResponseHelper.success(res, null, "Review deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}

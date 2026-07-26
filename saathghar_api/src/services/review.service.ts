import { ReviewMongoRepository } from "../repositories/review.repository";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { IReview } from "../models/review.model";
import { HttpException } from "../exceptions/http-exception";
import { NotificationService } from "./notification.service";

const reviewRepository = new ReviewMongoRepository();
const notificationService = new NotificationService();

export class ReviewService {
    async createReview(data: CreateReviewDTO, reviewerId: string): Promise<IReview> {
        if (data.reviewee === reviewerId) {
            throw new HttpException(400, "You cannot review yourself");
        }

        try {
            const review = await reviewRepository.create({
                reviewer: reviewerId as any,
                reviewee: data.reviewee as any,
                listing: data.listing as any || undefined,
                rating: data.rating,
                comment: data.comment,
            });

            notificationService.createNotification({
                recipient: data.reviewee,
                type: "review_received",
                title: "New Review Received",
                message: `Someone left you a ${data.rating}-star review`,
                relatedId: review._id.toString(),
            }).catch(() => {});

            return review;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new HttpException(400, "You have already reviewed this user for this listing");
            }
            throw error;
        }
    }

    async getReviewsForUser(userId: string): Promise<IReview[]> {
        return reviewRepository.findByReviewee(userId);
    }

    async getMyReviews(reviewerId: string): Promise<IReview[]> {
        return reviewRepository.findByReviewer(reviewerId);
    }

    async getReviewsForListing(listingId: string): Promise<IReview[]> {
        return reviewRepository.findByListing(listingId);
    }

    async getReviewById(id: string): Promise<IReview> {
        const review = await reviewRepository.findById(id);
        if (!review) {
            throw new HttpException(404, "Review not found");
        }
        return review;
    }

    async updateReview(id: string, data: UpdateReviewDTO, requesterId: string): Promise<IReview> {
        const review = await reviewRepository.findById(id);
        if (!review) {
            throw new HttpException(404, "Review not found");
        }

        if (review.reviewer._id.toString() !== requesterId) {
            throw new HttpException(403, "Only the reviewer can edit this review");
        }

        const updated = await reviewRepository.update(id, data);
        if (!updated) {
            throw new HttpException(400, "Failed to update review");
        }
        return updated;
    }

    async deleteReview(id: string, requesterId: string, isAdmin: boolean): Promise<boolean> {
        const review = await reviewRepository.findById(id);
        if (!review) {
            throw new HttpException(404, "Review not found");
        }

        if (review.reviewer._id.toString() !== requesterId && !isAdmin) {
            throw new HttpException(403, "Only the reviewer or admin can delete this review");
        }

        return reviewRepository.delete(id);
    }
}

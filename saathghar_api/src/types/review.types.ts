import { z } from "zod";

export const ReviewSchema = z.object({
    reviewer: z.string().min(1, "Reviewer ID is required"),
    reviewee: z.string().min(1, "Reviewee ID is required"),
    listing: z.string().optional(),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment is too long"),
});

export type ReviewTypes = z.infer<typeof ReviewSchema>;

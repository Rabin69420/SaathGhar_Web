import { z } from "zod";

export const CreateReviewDTO = z.object({
    reviewee: z.string().min(1, "Reviewee ID is required"),
    listing: z.string().optional(),
    rating: z.preprocess((val) => Number(val), z.number().min(1).max(5)),
    comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment is too long"),
});
export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;

export const UpdateReviewDTO = z.object({
    rating: z.preprocess((val) => Number(val), z.number().min(1).max(5)).optional(),
    comment: z.string().min(10).max(1000).optional(),
});
export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;

import { z } from "zod";

export const CreateItemDTO = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    rent: z.preprocess((val) => Number(val), z.number().min(0, "Rent must be a non-negative number")),
    location: z.string().min(1, "Location is required"),
    image: z.string().min(1, "Image filename is required"),
    video: z.string().optional()
});

export type CreateItemDTO = z.infer<typeof CreateItemDTO>;

export const UpdateItemDTO = CreateItemDTO.partial();
export type UpdateItemDTO = z.infer<typeof UpdateItemDTO>;

import { z } from "zod";

export const ItemSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long").max(100, "Title is too long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    rent: z.number().min(0, "Rent must be a non-negative number"),
    location: z.string().min(1, "Location is required"),
    image: z.string().min(1, "Image filename is required"),
    video: z.string().optional(),
    owner: z.string().min(1, "Owner ID is required")
});

export type ItemTypes = z.infer<typeof ItemSchema>;

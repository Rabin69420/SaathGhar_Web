import { z } from "zod";

export const CreateApplicationDTO = z.object({
    listing: z.string().min(1, "Listing ID is required"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});
export type CreateApplicationDTO = z.infer<typeof CreateApplicationDTO>;

export const UpdateApplicationStatusDTO = z.object({
    status: z.enum(["approved", "accepted", "rejected"]),
});
export type UpdateApplicationStatusDTO = z.infer<typeof UpdateApplicationStatusDTO>;

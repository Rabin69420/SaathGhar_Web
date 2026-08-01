import { z } from "zod";

export const ApplicationSchema = z.object({
    listing: z.string().min(1, "Listing ID is required"),
    applicant: z.string().min(1, "Applicant ID is required"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
    status: z.enum(["pending", "approved", "accepted", "rejected"]).default("pending"),
});

export type ApplicationTypes = z.infer<typeof ApplicationSchema>;

import { z } from "zod";

export const NotificationSchema = z.object({
    recipient: z.string(),
    type: z.enum(["application_received", "application_approved", "application_accepted", "application_rejected", "review_received", "system"]),
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(500),
    relatedId: z.string().optional(),
    read: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof NotificationSchema>;

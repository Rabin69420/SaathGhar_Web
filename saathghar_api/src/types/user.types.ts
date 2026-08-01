import {z} from "zod";

export const KycDocumentSchema = z.object({
    type: z.enum(["front", "back"]),
    filename: z.string(),
    uploadedAt: z.date().or(z.string()).optional()
});

export const UserSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    username: z.string().min(6, "Username must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
    role: z.enum(["admin", "user"]).default("user"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    imageUrl: z.string().optional(),
    kycStatus: z.enum(["unverified", "pending", "verified", "rejected"]).default("unverified"),
    kycDocuments: z.array(KycDocumentSchema).optional(),
    kycRejectionReason: z.string().optional(),
    preferences: z.object({
        preferredLocation: z.string().optional(),
        maxRent: z.number().optional(),
        propertyType: z.string().optional(),
        cleanliness: z.string().optional(),
        noiseLevel: z.string().optional(),
        sleepSchedule: z.string().optional(),
        diet: z.string().optional(),
        smoking: z.string().optional(),
        pets: z.string().optional(),
        guests: z.string().optional(),
        additionalInfo: z.string().optional()
    }).optional()
});

export type UserTypes = z.infer<typeof UserSchema>;
export type KycDocumentType = z.infer<typeof KycDocumentSchema>;
import { z } from "zod";

export const PreferencesDTO = z.object({
    cleanliness: z.enum(["High", "Medium", "Low"]).optional(),
    noiseLevel: z.enum(["Quiet", "Moderate", "Loud"]).optional(),
    sleepSchedule: z.enum(["Early Bird", "Night Owl", "Flexible"]).optional(),
    diet: z.enum(["No preference", "Vegetarian", "Vegan", "Non-Vegetarian"]).optional(),
    smoking: z.enum(["Non-smoker", "Smoker", "Outside only"]).optional(),
    pets: z.enum(["Pet friendly", "No pets", "Have pets"]).optional(),
    guests: z.enum(["No guests", "Occasionally", "Frequently"]).optional(),
    additionalInfo: z.string().max(500).optional(),
});

export type PreferencesDTOType = z.infer<typeof PreferencesDTO>;

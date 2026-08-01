import { z } from "zod";

export const PreferencesDTO = z.object({
    preferredLocation: z.string().max(200).optional(),
    maxRent: z.preprocess((val) => (val === null || val === "" || val === undefined ? undefined : Number(val)), z.number().positive().max(10000000).optional()),
    propertyType: z.enum(["Room", "Shared Room", "Apartment", "Studio", "House", "Hostel"]).optional(),
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

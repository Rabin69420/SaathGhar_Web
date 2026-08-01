import { ItemMongoRepository } from "../repositories/item.repository";
import { CreateItemDTO, UpdateItemDTO } from "../dtos/item.dto";
import { IItem } from "../models/item.model";
import { HttpException } from "../exceptions/http-exception";

const itemRepository = new ItemMongoRepository();

export class ItemService {
    async createItem(itemData: CreateItemDTO, ownerId: string): Promise<IItem> {
        const { UserModel } = await import("../models/user.model");
        const user = await UserModel.findById(ownerId);
        if (!user || user.kycStatus !== "verified") {
            throw new HttpException(403, "KYC verification required to post a listing");
        }

        const item = await itemRepository.createItem({
            ...itemData,
            owner: ownerId as any
        });
        return item;
    }

    async getAllItems(): Promise<IItem[]> {
        return await itemRepository.getAllItems();
    }

    async getItemById(id: string): Promise<IItem> {
        const item = await itemRepository.getItemById(id);
        if (!item) {
            throw new HttpException(404, "Item not found");
        }
        return item;
    }

    async updateItem(id: string, itemData: UpdateItemDTO, userId: string, isAdmin: boolean): Promise<IItem> {
        const item = await itemRepository.getItemById(id);
        if (!item) {
            throw new HttpException(404, "Item not found");
        }

        // Only owner or admin can update
        const ownerId = (item.owner as any)._id?.toString() || item.owner.toString();
        if (ownerId !== userId && !isAdmin) {
            throw new HttpException(403, "You do not have permission to update this item");
        }

        const updated = await itemRepository.updateItem(id, itemData);
        if (!updated) {
            throw new HttpException(400, "Failed to update item");
        }
        return updated;
    }

    async deleteItem(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
        const item = await itemRepository.getItemById(id);
        if (!item) {
            throw new HttpException(404, "Item not found");
        }

        // Only owner or admin can delete
        const ownerId = (item.owner as any)._id?.toString() || item.owner.toString();
        if (ownerId !== userId && !isAdmin) {
            throw new HttpException(403, "You do not have permission to delete this item");
        }

        return await itemRepository.deleteItem(id);
    }

    async getMyListings(userId: string): Promise<IItem[]> {
        return await itemRepository.getItemsByOwner(userId);
    }

    async getBookmarkedListings(userId: string): Promise<IItem[]> {
        return await itemRepository.getBookmarkedItems(userId);
    }

    async toggleBookmark(userId: string, itemId: string): Promise<{ bookmarked: boolean }> {
        const item = await itemRepository.getItemById(itemId);
        if (!item) {
            throw new HttpException(404, "Item not found");
        }

        const { UserModel } = await import("../models/user.model");
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        if (!user.bookmarks) {
            user.bookmarks = [];
        }

        const index = user.bookmarks.indexOf(itemId as any);
        let bookmarked = false;
        if (index === -1) {
            user.bookmarks.push(itemId as any);
            bookmarked = true;
        } else {
            user.bookmarks.splice(index, 1);
            bookmarked = false;
        }
        await user.save();
        return { bookmarked };
    }

    async checkCompatibility(itemId: string, seekerId: string, customPreferences?: any): Promise<any> {
        const item = await this.getItemById(itemId);
        const { UserModel } = await import("../models/user.model");
        const seeker = await UserModel.findById(seekerId);
        if (!seeker) {
            throw new HttpException(404, "Seeker not found");
        }

        const seekerPrefs = customPreferences || seeker.preferences || {};
        const providerPrefs = (item.owner as any)?.preferences || {};

        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const prompt = `
Analyze the lifestyle compatibility between a roomseeker looking for a room and the room listing and room provider details:

Room Seeker Lifestyle Preferences:
- Cleanliness level: ${seekerPrefs.cleanliness || "Not specified"}
- Noise tolerance: ${seekerPrefs.noiseLevel || "Not specified"}
- Sleep schedule: ${seekerPrefs.sleepSchedule || "Not specified"}
- Diet preference: ${seekerPrefs.diet || "Not specified"}
- Smoking policy: ${seekerPrefs.smoking || "Not specified"}
- Pet friendliness: ${seekerPrefs.pets || "Not specified"}
- Guest policy: ${seekerPrefs.guests || "Not specified"}
- Additional self-description: ${seekerPrefs.additionalInfo || "Not specified"}

Room Listing Details:
- Title: ${item.title}
- Location: ${item.location}
- Rent: Rs. ${item.rent} / month
- Room Description: ${item.description}

Room Provider (Owner/Landlord) Profile:
- Name: ${(item.owner as any)?.fullName || "Verified User"}
- Cleanliness preference: ${providerPrefs.cleanliness || "Not specified"}
- Noise policy: ${providerPrefs.noiseLevel || "Not specified"}
- Sleep schedule policy: ${providerPrefs.sleepSchedule || "Not specified"}
- Diet policy: ${providerPrefs.diet || "Not specified"}
- Smoking policy: ${providerPrefs.smoking || "Not specified"}
- Pet policy: ${providerPrefs.pets || "Not specified"}
- Guest policy: ${providerPrefs.guests || "Not specified"}
- Additional info: ${providerPrefs.additionalInfo || "Not specified"}

Provide a compatibility report. You must output ONLY a valid raw JSON object matching this schema (do not wrap in markdown block, just return the raw text):
{
  "score": <number between 0 and 100>,
  "summary": "<2-3 sentences summarizing overall compatibility>",
  "matchingPoints": ["<point 1>", "<point 2>", ...],
  "conflictPoints": ["<point 1>", "<point 2>", ...],
  "recommendations": ["<advice 1>", "<advice 2>", ...]
}
`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Gemini API error: ${response.statusText}`);
                }

                const result = (await response.json()) as any;
                const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    let clean = text.trim();
                    if (clean.startsWith("```")) {
                        clean = clean.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
                    }
                    return JSON.parse(clean);
                }
            } catch (error) {
                console.error("Error generating compatibility via Gemini, using fallback:", error);
            }
        }

        // Run fallback algorithm if key doesn't exist or API call fails
        return this.runFallbackCompatibility(item, seekerPrefs, providerPrefs);
    }

    private runFallbackCompatibility(item: any, seekerPrefs: any, providerPrefs: any) {
        let score = 75;
        const matchingPoints: string[] = [];
        const conflictPoints: string[] = [];
        const recommendations: string[] = [];

        // Cleanliness (weight: 5/-8)
        if (seekerPrefs.cleanliness && providerPrefs.cleanliness) {
            if (seekerPrefs.cleanliness === providerPrefs.cleanliness) {
                score += 5;
                matchingPoints.push(`Both prefer ${seekerPrefs.cleanliness.toLowerCase()} cleanliness standards.`);
            } else {
                score -= 8;
                conflictPoints.push(`Cleanliness mismatch: you prefer ${seekerPrefs.cleanliness.toLowerCase()}, landlord prefers ${providerPrefs.cleanliness.toLowerCase()}.`);
                recommendations.push("Discuss and agree on a cleaning schedule before moving in.");
            }
        } else {
            recommendations.push("Discuss cleanliness standards and chore schedules.");
        }

        // Smoking (weight: 10/-18 — highest impact)
        if (seekerPrefs.smoking && providerPrefs.smoking) {
            if (seekerPrefs.smoking === providerPrefs.smoking) {
                score += 10;
                matchingPoints.push(`Smoking policy aligned: both are ${seekerPrefs.smoking.toLowerCase()}.`);
            } else {
                score -= 18;
                conflictPoints.push(`Smoking conflict: you are ${seekerPrefs.smoking.toLowerCase()}, landlord is ${providerPrefs.smoking.toLowerCase()}.`);
                recommendations.push("Clarify the smoking policy in writing before committing.");
            }
        }

        // Noise level (weight: 5/-8) — direct comparison added
        if (seekerPrefs.noiseLevel && providerPrefs.noiseLevel) {
            if (seekerPrefs.noiseLevel === providerPrefs.noiseLevel) {
                score += 5;
                matchingPoints.push(`Noise tolerance aligned: both prefer ${seekerPrefs.noiseLevel.toLowerCase()} environment.`);
            } else if (
                (seekerPrefs.noiseLevel === "Quiet" && providerPrefs.noiseLevel === "Loud") ||
                (seekerPrefs.noiseLevel === "Loud" && providerPrefs.noiseLevel === "Quiet")
            ) {
                score -= 8;
                conflictPoints.push(`Noise level conflict: you prefer ${seekerPrefs.noiseLevel.toLowerCase()}, landlord prefers ${providerPrefs.noiseLevel.toLowerCase()}.`);
                recommendations.push("Agree on quiet hours to avoid noise-related friction.");
            } else {
                // Moderate vs Quiet/Loud — minor mismatch
                score -= 3;
                conflictPoints.push(`Minor noise preference difference (${seekerPrefs.noiseLevel} vs ${providerPrefs.noiseLevel}).`);
            }
        } else {
            // Fallback: check listing description keywords
            const desc = (item.description || "").toLowerCase();
            if ((desc.includes("quiet") || desc.includes("peaceful")) && seekerPrefs.noiseLevel === "Quiet") {
                score += 4;
                matchingPoints.push("Listing description suggests a quiet environment matching your preference.");
            }
        }

        // Sleep schedule (weight: 5/-8, Flexible = neutral)
        if (seekerPrefs.sleepSchedule && providerPrefs.sleepSchedule) {
            if (seekerPrefs.sleepSchedule === providerPrefs.sleepSchedule) {
                score += 5;
                matchingPoints.push(`Sleep schedules match: both are ${seekerPrefs.sleepSchedule.toLowerCase()}.`);
            } else if (seekerPrefs.sleepSchedule === "Flexible" || providerPrefs.sleepSchedule === "Flexible") {
                // Flexible is a partial match — no penalty, no bonus
                matchingPoints.push("At least one party has a flexible sleep schedule, reducing schedule friction.");
            } else if (
                (seekerPrefs.sleepSchedule === "Early Bird" && providerPrefs.sleepSchedule === "Night Owl") ||
                (seekerPrefs.sleepSchedule === "Night Owl" && providerPrefs.sleepSchedule === "Early Bird")
            ) {
                score -= 8;
                conflictPoints.push(`Sleep schedule clash: you are an ${seekerPrefs.sleepSchedule}, landlord is a ${providerPrefs.sleepSchedule}.`);
                recommendations.push("Discuss quiet hours to accommodate different sleep schedules.");
            }
        }

        // Diet (weight: 4/0 for no-pref, -4 for hard mismatch)
        if (seekerPrefs.diet && providerPrefs.diet) {
            if (seekerPrefs.diet === providerPrefs.diet) {
                score += 4;
                matchingPoints.push(`Diet preferences align: both are ${seekerPrefs.diet.toLowerCase()}.`);
            } else if (seekerPrefs.diet !== "No preference" && providerPrefs.diet !== "No preference") {
                score -= 4;
                conflictPoints.push(`Diet difference: you are ${seekerPrefs.diet.toLowerCase()}, landlord is ${providerPrefs.diet.toLowerCase()}.`);
                recommendations.push("Confirm shared kitchen rules around food storage and cooking.");
            }
        }

        // Guests (weight: 3/0)
        if (seekerPrefs.guests && providerPrefs.guests) {
            if (seekerPrefs.guests === providerPrefs.guests) {
                score += 3;
                matchingPoints.push(`Guest policy aligned: both allow guests ${seekerPrefs.guests.toLowerCase()}.`);
            } else if (seekerPrefs.guests === "Frequently" && providerPrefs.guests === "No guests") {
                score -= 5;
                conflictPoints.push("Guest policy conflict: you prefer frequent guests, landlord prefers none.");
                recommendations.push("Clarify guest rules and overnight stay policies upfront.");
            } else {
                recommendations.push("Discuss guest frequency expectations to avoid misunderstandings.");
            }
        }

        // Pets (weight: 0 match, -10 hard conflict)
        if (seekerPrefs.pets && providerPrefs.pets) {
            if (seekerPrefs.pets === "No pets" && providerPrefs.pets === "No pets") {
                matchingPoints.push("Both prefer a pet-free household.");
            } else if (seekerPrefs.pets === "Have pets" && providerPrefs.pets === "No pets") {
                score -= 10;
                conflictPoints.push("Pet conflict: you have pets but the landlord does not allow them.");
                recommendations.push("Confirm pet policy directly with the landlord before applying.");
            } else if (seekerPrefs.pets === "Pet friendly" && providerPrefs.pets === "Pet friendly") {
                matchingPoints.push("Both are comfortable with pets in the household.");
            }
        }

        score = Math.max(10, Math.min(100, score));

        let summary = `Your lifestyle compatibility score is ${score}%. `;
        if (score >= 80) {
            summary += "Your profiles align exceptionally well. This listing looks like a great fit!";
        } else if (score >= 60) {
            summary += "Decent compatibility overall. Minor differences can be resolved with clear communication.";
        } else {
            summary += "There are notable lifestyle differences. Review the conflicts below and discuss them with the landlord before committing.";
        }

        if (conflictPoints.length === 0) conflictPoints.push("No major lifestyle conflicts identified.");
        if (matchingPoints.length === 0) matchingPoints.push("Standard roommate profile compatibility.");

        recommendations.push("Schedule a viewing and introduce yourself to the landlord.");
        recommendations.push("Confirm utility billing, internet access, and house rules in writing.");

        return { score, summary, matchingPoints, conflictPoints, recommendations };
    }
}

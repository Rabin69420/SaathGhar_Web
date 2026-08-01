import { Request, Response } from "express";
import { KycService } from "../services/kyc.service";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";

const kycService = new KycService();

export class KycController {
    async submitKyc(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const documents: { type: "front" | "back"; filename: string }[] = [];

            if (files?.front?.[0]) documents.push({ type: "front", filename: files.front[0].filename });
            if (files?.back?.[0]) documents.push({ type: "back", filename: files.back[0].filename });

            const userId = (req.user as any)._id.toString();
            await kycService.submitKyc(userId, documents);
            return ApiResponseHelper.success(res, null, "KYC documents submitted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyKycStatus(req: Request, res: Response) {
        try {
            if (!req.user) return ApiResponseHelper.error(res, "Unauthorized", 401);
            const userId = (req.user as any)._id.toString();
            const data = await kycService.getKycStatus(userId);
            return ApiResponseHelper.success(res, data, "KYC status fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getPendingSubmissions(req: Request, res: Response) {
        try {
            const data = await kycService.getPendingSubmissions();
            return ApiResponseHelper.success(res, data, "Pending KYC submissions fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async reviewSubmission(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            const { decision, reason } = req.body;

            if (!decision || !["verified", "rejected"].includes(decision)) {
                return ApiResponseHelper.error(res, "Decision must be 'verified' or 'rejected'", 400);
            }

            await kycService.reviewKyc(userId, decision, reason);
            return ApiResponseHelper.success(res, null, `KYC ${decision} successfully`);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}

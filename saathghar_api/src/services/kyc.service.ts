import { UserModel } from "../models/user.model";
import { NotificationService } from "./notification.service";
import { HttpException } from "../exceptions/http-exception";

const notificationService = new NotificationService();

export class KycService {
    async submitKyc(userId: string, documents: { type: "front" | "back"; filename: string }[]): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) throw new HttpException(404, "User not found");

        if (user.kycStatus === "pending") throw new HttpException(400, "KYC is already under review");
        if (user.kycStatus === "verified") throw new HttpException(400, "Your KYC is already verified");

        const hasFront = documents.some(d => d.type === "front");
        const hasBack = documents.some(d => d.type === "back");
        if (!hasFront || !hasBack) throw new HttpException(400, "Both front and back ID images are required");

        user.kycStatus = "pending";
        user.kycDocuments = documents.map(d => ({ ...d, uploadedAt: new Date() }));
        user.kycRejectionReason = undefined;
        await user.save();
    }

    async getKycStatus(userId: string) {
        const user = await UserModel.findById(userId).select("kycStatus kycDocuments kycRejectionReason");
        if (!user) throw new HttpException(404, "User not found");
        return { kycStatus: user.kycStatus, kycDocuments: user.kycDocuments, kycRejectionReason: user.kycRejectionReason };
    }

    async getPendingSubmissions() {
        return UserModel.find({ kycStatus: "pending" }).select("_id fullName email kycDocuments kycStatus createdAt");
    }

    async reviewKyc(userId: string, decision: "verified" | "rejected", reason?: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) throw new HttpException(404, "User not found");
        if (user.kycStatus !== "pending") throw new HttpException(400, "Only pending KYC submissions can be reviewed");

        user.kycStatus = decision;
        if (decision === "rejected" && reason) user.kycRejectionReason = reason;
        await user.save();

        notificationService.createNotification({
            recipient: userId,
            type: decision === "verified" ? "kyc_approved" : "kyc_rejected",
            title: decision === "verified" ? "KYC Verified" : "KYC Rejected",
            message: decision === "verified"
                ? "Your identity has been verified. You can now post listings and apply to rooms."
                : `Your KYC was rejected.${reason ? ` Reason: ${reason}` : ""} Please resubmit with valid documents.`,
            relatedId: userId,
        }).catch(() => {});
    }
}

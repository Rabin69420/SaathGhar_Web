import { ApplicationMongoRepository } from "../repositories/application.repository";
import { CreateApplicationDTO } from "../dtos/application.dto";
import { IApplication } from "../models/application.model";
import { HttpException } from "../exceptions/http-exception";
import { ItemMongoRepository } from "../repositories/item.repository";
import { NotificationService } from "./notification.service";
import { UserModel } from "../models/user.model";

const applicationRepository = new ApplicationMongoRepository();
const itemRepository = new ItemMongoRepository();
const notificationService = new NotificationService();

export class ApplicationService {
    async createApplication(data: CreateApplicationDTO, applicantId: string): Promise<IApplication> {
        const listing = await itemRepository.getItemById(data.listing);
        if (!listing) {
            throw new HttpException(404, "Listing not found");
        }

        const ownerId = (listing.owner as any)._id?.toString() || listing.owner.toString();
        if (ownerId === applicantId) {
            throw new HttpException(400, "You cannot apply to your own listing");
        }

        const applicant = await UserModel.findById(applicantId);
        if (!applicant || applicant.kycStatus !== "verified") {
            throw new HttpException(403, "KYC verification required to apply for a room");
        }

        try {
            const application = await applicationRepository.create({
                listing: data.listing as any,
                applicant: applicantId as any,
                message: data.message,
                status: "pending",
            });

            const admins = await UserModel.find({ role: "admin" }).select("_id");
            for (const admin of admins) {
                notificationService.createNotification({
                    recipient: admin._id.toString(),
                    type: "application_received",
                    title: "New Room Application",
                    message: `New application for "${listing.title}" needs your review`,
                    relatedId: application._id.toString(),
                }).catch(() => {});
            }

            return application;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new HttpException(400, "You have already applied to this listing");
            }
            throw error;
        }
    }

    async getMyApplications(applicantId: string): Promise<IApplication[]> {
        return applicationRepository.findByApplicant(applicantId);
    }

    async getApplicationsForListing(listingId: string, requesterId: string, isAdmin: boolean): Promise<IApplication[]> {
        const listing = await itemRepository.getItemById(listingId);
        if (!listing) {
            throw new HttpException(404, "Listing not found");
        }

        const ownerId = listing.owner?._id?.toString() || listing.owner?.toString();
        if (ownerId !== requesterId && !isAdmin) {
            throw new HttpException(403, "Only the listing owner can view applications");
        }

        return applicationRepository.findByListing(listingId);
    }

    async getApplicationById(id: string, requesterId: string, isAdmin: boolean): Promise<IApplication> {
        const application = await applicationRepository.findById(id);
        if (!application) {
            throw new HttpException(404, "Application not found");
        }

        const isApplicant = application.applicant._id.toString() === requesterId;
        const isListingOwner = (application.listing as any)?.owner?._id?.toString() === requesterId ||
            (application.listing as any)?.owner?.toString() === requesterId;

        if (!isApplicant && !isListingOwner && !isAdmin) {
            throw new HttpException(403, "You do not have access to this application");
        }

        return application;
    }

    async updateApplicationStatus(id: string, status: string, requesterId: string, isAdmin: boolean): Promise<IApplication> {
        const application = await applicationRepository.findById(id);
        if (!application) {
            throw new HttpException(404, "Application not found");
        }

        const listingOwnerId = (application.listing as any)?.owner?._id?.toString() ||
            (application.listing as any)?.owner?.toString();
        const listingTitle = (application.listing as any)?.title || "a listing";

        if (status === "approved") {
            if (!isAdmin) {
                throw new HttpException(403, "Only an admin can approve applications");
            }
            if (application.status !== "pending") {
                throw new HttpException(400, "Only pending applications can be approved");
            }

            const updated = await applicationRepository.updateStatus(id, status);
            if (!updated) {
                throw new HttpException(400, "Failed to update application status");
            }

            if (listingOwnerId) {
                notificationService.createNotification({
                    recipient: listingOwnerId,
                    type: "application_approved",
                    title: "Application Forwarded to You",
                    message: `An application for your listing "${listingTitle}" has been approved by admin and needs your decision`,
                    relatedId: id,
                }).catch(() => {});
            }

            return updated;
        }

        if (status === "rejected" && application.status === "pending") {
            if (!isAdmin) {
                throw new HttpException(403, "Only an admin can reject pending applications");
            }

            const updated = await applicationRepository.updateStatus(id, status);
            if (!updated) {
                throw new HttpException(400, "Failed to update application status");
            }

            notificationService.createNotification({
                recipient: application.applicant._id.toString(),
                type: "application_rejected",
                title: "Application Declined",
                message: `Your application to "${listingTitle}" was declined by admin`,
                relatedId: id,
            }).catch(() => {});

            return updated;
        }

        if ((status === "accepted" || status === "rejected") && application.status === "approved") {
            if (listingOwnerId !== requesterId && !isAdmin) {
                throw new HttpException(403, "Only the listing owner can accept or reject approved applications");
            }

            const updated = await applicationRepository.updateStatus(id, status);
            if (!updated) {
                throw new HttpException(400, "Failed to update application status");
            }

            const notifType = status === "accepted" ? "application_accepted" : "application_rejected";
            notificationService.createNotification({
                recipient: application.applicant._id.toString(),
                type: notifType,
                title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message: `Your application to "${listingTitle}" has been ${status} by the listing owner`,
                relatedId: id,
            }).catch(() => {});

            return updated;
        }

        throw new HttpException(400, `Cannot change status from "${application.status}" to "${status}"`);
    }

    async deleteApplication(id: string, requesterId: string, isAdmin: boolean): Promise<boolean> {
        const application = await applicationRepository.findById(id);
        if (!application) {
            throw new HttpException(404, "Application not found");
        }

        const isApplicant = application.applicant._id.toString() === requesterId;

        if (!isApplicant && !isAdmin) {
            throw new HttpException(403, "Only the applicant can withdraw their application");
        }

        if (isApplicant && application.status !== "pending") {
            throw new HttpException(400, "You can only withdraw pending applications");
        }

        return applicationRepository.delete(id);
    }
}

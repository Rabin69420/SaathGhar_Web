import { ApplicationMongoRepository } from "../repositories/application.repository";
import { CreateApplicationDTO } from "../dtos/application.dto";
import { IApplication } from "../models/application.model";
import { HttpException } from "../exceptions/http-exception";
import { ItemMongoRepository } from "../repositories/item.repository";
import { NotificationService } from "./notification.service";

const applicationRepository = new ApplicationMongoRepository();
const itemRepository = new ItemMongoRepository();
const notificationService = new NotificationService();

export class ApplicationService {
    async createApplication(data: CreateApplicationDTO, applicantId: string): Promise<IApplication> {
        const listing = await itemRepository.getItemById(data.listing);
        if (!listing) {
            throw new HttpException(404, "Listing not found");
        }

        if (listing.owner.toString() === applicantId) {
            throw new HttpException(400, "You cannot apply to your own listing");
        }

        try {
            const application = await applicationRepository.create({
                listing: data.listing as any,
                applicant: applicantId as any,
                message: data.message,
                status: "pending",
            });

            notificationService.createNotification({
                recipient: listing.owner.toString(),
                type: "application_received",
                title: "New Room Application",
                message: `Someone applied to your listing "${listing.title}"`,
                relatedId: application._id.toString(),
            }).catch(() => {});

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

        if (listing.owner.toString() !== requesterId && !isAdmin) {
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

        if (listingOwnerId !== requesterId && !isAdmin) {
            throw new HttpException(403, "Only the listing owner can accept or reject applications");
        }

        const updated = await applicationRepository.updateStatus(id, status);
        if (!updated) {
            throw new HttpException(400, "Failed to update application status");
        }

        const notifType = status === "accepted" ? "application_accepted" : "application_rejected";
        const listingTitle = (application.listing as any)?.title || "a listing";
        notificationService.createNotification({
            recipient: application.applicant._id.toString(),
            type: notifType,
            title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your application to "${listingTitle}" has been ${status}`,
            relatedId: id,
        }).catch(() => {});

        return updated;
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

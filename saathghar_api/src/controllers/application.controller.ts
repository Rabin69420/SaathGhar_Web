import { Request, Response } from "express";
import { ApplicationService } from "../services/application.service";
import { CreateApplicationDTO, UpdateApplicationStatusDTO } from "../dtos/application.dto";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";
import { z } from "zod";

const applicationService = new ApplicationService();

export class ApplicationController {
    async createApplication(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const parsed = CreateApplicationDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const applicantId = (req.user as any)._id.toString();
            const application = await applicationService.createApplication(parsed.data, applicantId);
            return ApiResponseHelper.success(res, application, "Application submitted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyApplications(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const applicantId = (req.user as any)._id.toString();
            const applications = await applicationService.getMyApplications(applicantId);
            return ApiResponseHelper.success(res, applications, "Applications fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getApplicationsForListing(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const listingId = req.params.listingId as string;
            const requesterId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const applications = await applicationService.getApplicationsForListing(listingId, requesterId, isAdmin);
            return ApiResponseHelper.success(res, applications, "Applications for listing fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getApplicationById(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const id = req.params.id as string;
            const requesterId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const application = await applicationService.getApplicationById(id, requesterId, isAdmin);
            return ApiResponseHelper.success(res, application, "Application fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateApplicationStatus(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const parsed = UpdateApplicationStatusDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }

            const id = req.params.id as string;
            const requesterId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const application = await applicationService.updateApplicationStatus(id, parsed.data.status, requesterId, isAdmin);
            return ApiResponseHelper.success(res, application, `Application ${parsed.data.status} successfully`);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteApplication(req: Request, res: Response) {
        try {
            if (!req.user) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const id = req.params.id as string;
            const requesterId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            await applicationService.deleteApplication(id, requesterId, isAdmin);
            return ApiResponseHelper.success(res, null, "Application withdrawn successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}

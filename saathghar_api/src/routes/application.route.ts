import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const applicationRouter = Router();
const applicationController = new ApplicationController();

applicationRouter.post("/", authorizedMiddleware, applicationController.createApplication);
applicationRouter.get("/my-applications", authorizedMiddleware, applicationController.getMyApplications);
applicationRouter.get("/listing/:listingId", authorizedMiddleware, applicationController.getApplicationsForListing);
applicationRouter.get("/:id", authorizedMiddleware, applicationController.getApplicationById);
applicationRouter.put("/:id/status", authorizedMiddleware, applicationController.updateApplicationStatus);
applicationRouter.delete("/:id", authorizedMiddleware, applicationController.deleteApplication);

export default applicationRouter;

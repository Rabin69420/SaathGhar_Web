import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authorizedMiddleware, adminMiddleware } from "../middlewares/auth.middleware";

const adminRouter = Router();
const adminController = new AdminController();

// Apply auth & admin middlewares to all admin routes
adminRouter.use(authorizedMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get("/stats", adminController.getStats);
adminRouter.get("/users", adminController.getAllUsers);
adminRouter.delete("/users/:id", adminController.deleteUser);
adminRouter.get("/listings", adminController.getAllListings);
adminRouter.delete("/listings/:id", adminController.deleteListing);

export default adminRouter;

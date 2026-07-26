import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const notificationRouter = Router();
const controller = new NotificationController();

notificationRouter.use(authorizedMiddleware);

notificationRouter.get("/", controller.getNotifications);
notificationRouter.get("/unread-count", controller.getUnreadCount);
notificationRouter.put("/:id/read", controller.markAsRead);
notificationRouter.put("/read-all", controller.markAllAsRead);
notificationRouter.delete("/:id", controller.deleteNotification);

export default notificationRouter;

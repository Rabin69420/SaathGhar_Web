import {UserController} from "../controllers/user.controller";
import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const userRouter = Router();
const userController = new UserController();

// Setup multer upload directory
const UPLOADS_PATH = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/whoami", authorizedMiddleware, userController.whoamiUser);
userRouter.get("/whoami", authorizedMiddleware, userController.whoamiUser);
userRouter.put("/update", authorizedMiddleware, upload.single("image"), userController.updateProfile);
userRouter.get("/preferences", authorizedMiddleware, userController.getPreferences);
userRouter.put("/preferences", authorizedMiddleware, userController.updatePreferences);
userRouter.delete("/preferences", authorizedMiddleware, userController.resetPreferences);
userRouter.get("/saved-roommates", authorizedMiddleware, userController.getSavedRoommates);
userRouter.post("/saved-roommates/:roommateId", authorizedMiddleware, userController.toggleSavedRoommate);

export default userRouter;
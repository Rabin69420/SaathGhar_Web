import { Router } from "express";
import { KycController } from "../controllers/kyc.controller";
import { authorizedMiddleware, adminMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const kycRouter = Router();
const kycController = new KycController();

const UPLOADS_PATH = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_PATH),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext && mime);
    }
});

// User routes
kycRouter.post(
    "/submit",
    authorizedMiddleware,
    upload.fields([
        { name: "front", maxCount: 1 },
        { name: "back", maxCount: 1 }
    ]),
    kycController.submitKyc
);
kycRouter.get("/status", authorizedMiddleware, kycController.getMyKycStatus);

// Admin routes
kycRouter.get("/pending", authorizedMiddleware, adminMiddleware, kycController.getPendingSubmissions);
kycRouter.patch("/:userId", authorizedMiddleware, adminMiddleware, kycController.reviewSubmission);

export default kycRouter;

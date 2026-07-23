import { Router, Request, Response } from "express";
import { ApiResponseHelper } from "../utils/apiResponseHelper.utils";
import multer from "multer";
import path from "path";
import fs from "fs";

const fileRouter = Router();

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
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for videos/images
});

// Use upload.any() to handle both 'file' and 'image' input names
fileRouter.post("/upload", upload.any(), (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return ApiResponseHelper.error(res, "No file uploaded", 400);
        }
        
        const uploadedFile = files[0];
        if (!uploadedFile) {
            return ApiResponseHelper.error(res, "Failed to upload file", 400);
        }

        return ApiResponseHelper.success(res, {
            filename: uploadedFile.filename,
            name: uploadedFile.filename
        }, "File uploaded successfully");
    } catch (error: any) {
        return ApiResponseHelper.error(res, error.message || "Internal Server Error", 500);
    }
});

export default fileRouter;

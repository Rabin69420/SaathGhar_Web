import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const itemRouter = Router();
const itemController = new ItemController();

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

itemRouter.get("/", itemController.getItems);
itemRouter.get("/my-listings", authorizedMiddleware, itemController.getMyListings);
itemRouter.get("/bookmarked", authorizedMiddleware, itemController.getBookmarkedListings);
itemRouter.get("/:id", itemController.getItem);
itemRouter.post("/", authorizedMiddleware, upload.single("image"), itemController.createItem);
itemRouter.post("/:id/bookmark", authorizedMiddleware, itemController.toggleBookmark);
itemRouter.post("/:id/compatibility", authorizedMiddleware, itemController.checkCompatibility);
itemRouter.put("/:id", authorizedMiddleware, upload.single("image"), itemController.updateItem);
itemRouter.delete("/:id", authorizedMiddleware, itemController.deleteItem);

export default itemRouter;

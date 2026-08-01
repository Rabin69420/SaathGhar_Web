import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apiResponseHelper.utils";
import cors  from "cors";
import path from "path";

// routes
import userRoutes from "./routes/user.route";
import itemRoutes from "./routes/item.route";
import fileRoutes from "./routes/file.route";
import adminRoutes from "./routes/admin.route";
import applicationRoutes from "./routes/application.route";
import reviewRoutes from "./routes/review.route";
import notificationRoutes from "./routes/notification.route";
import kycRoutes from "./routes/kyc.route";

const app: Application = express();
const corsOptions = {
    origin: ["*"], // ["http://localhost:3000", "http://example.com"]
    successStatus: 200
}
app.use(cors(corsOptions)); // enable CORS for all routes

app.use(express.json()); // json input
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/auth", userRoutes); // user related routes
app.use("/api/v1/items", itemRoutes); // items related routes
app.use("/api/v1/listings", itemRoutes); // listings alias for mobile app
app.use("/api/v1/file", fileRoutes); // generic file upload route
app.use("/api/v1/admin", adminRoutes); // admin related routes
app.use("/api/v1/applications", applicationRoutes); // application related routes
app.use("/api/v1/reviews", reviewRoutes); // review related routes
app.use("/api/v1/notifications", notificationRoutes); // notification related routes
app.use("/api/v1/kyc", kycRoutes); // KYC verification routes


// global api handler (at the last)
app.use(
    (req: Request, res: Response) => {
        return res.status(404).json({ message: "API not found" });
    }
)
// global error handler (at the last)
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("Error:", err);
        if(err instanceof HttpException){
            return ApiResponseHelper.error(
                res, err.message, err.status
            );
        }
        return ApiResponseHelper.error(
            res, "Internal Server Error", 500
        );
    }
)

export default app;
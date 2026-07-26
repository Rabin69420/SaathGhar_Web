import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.post("/", authorizedMiddleware, reviewController.createReview);
reviewRouter.get("/my-reviews", authorizedMiddleware, reviewController.getMyReviews);
reviewRouter.get("/user/:userId", reviewController.getReviewsForUser);
reviewRouter.get("/listing/:listingId", reviewController.getReviewsForListing);
reviewRouter.get("/:id", reviewController.getReviewById);
reviewRouter.put("/:id", authorizedMiddleware, reviewController.updateReview);
reviewRouter.delete("/:id", authorizedMiddleware, reviewController.deleteReview);

export default reviewRouter;

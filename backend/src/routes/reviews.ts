import { Router } from "express";
import {
  createReview,
  deleteReviewById,
  getReviewById,
  listReviews,
  updateReviewById,
} from "../controllers/reviewController";

const router = Router();

router.get("/", listReviews);
router.post("/", createReview);
router.get("/:id", getReviewById);
router.put("/:id", updateReviewById);
router.delete("/:id", deleteReviewById);

export default router;

import { Request, Response } from "express";
import Review, { IReview } from "../models/Review";

type ReviewBody = {
  engineer_id?: string;
  client_id?: string;
  project_id?: string;
  rating?: unknown;
  comment?: string;
};

function parseNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toReviewDTO(review: IReview | null) {
  if (!review) return null;

  return {
    id: String(review._id),
    engineer_id: review.engineer_id,
    client_id: review.client_id,
    project_id: review.project_id,
    rating: review.rating,
    comment: review.comment,
    created_at: (review as unknown as { created_at?: Date }).created_at,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

export async function createReview(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as ReviewBody;

    if (
      !body.engineer_id ||
      !body.client_id ||
      !body.project_id ||
      !body.comment
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rating = parseNumber(body.rating);
    if (rating === undefined || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      engineer_id: body.engineer_id,
      client_id: body.client_id,
      project_id: body.project_id,
      rating,
      comment: body.comment,
    });

    return res.status(201).json(toReviewDTO(review));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listReviews(_req: Request, res: Response) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews.map((review) => toReviewDTO(review)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getReviewById(req: Request, res: Response) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json(toReviewDTO(review));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateReviewById(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as ReviewBody;
    const updates: Record<string, unknown> = {
      engineer_id: body.engineer_id,
      client_id: body.client_id,
      project_id: body.project_id,
      rating: parseNumber(body.rating),
      comment: body.comment,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json(toReviewDTO(review));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteReviewById(req: Request, res: Response) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

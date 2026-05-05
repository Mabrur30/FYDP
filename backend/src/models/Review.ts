import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  engineer_id: mongoose.Types.ObjectId;
  client_id: mongoose.Types.ObjectId;
  project_id: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    engineer_id: {
      type: Schema.Types.ObjectId,
      ref: "Engineer",
      required: true,
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IReview>("Review", ReviewSchema);

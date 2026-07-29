import mongoose, { Document, Schema } from "mongoose";

export interface IBid extends Document {
  engineerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  amount: number;
  status:
    | "pending"
    | "under_review"
    | "shortlisted"
    | "won"
    | "lost"
    | "withdrawn";
  submittedAt: Date;
  deadline?: Date;
  proposal?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema(
  {
    engineerId: {
      type: Schema.Types.ObjectId,
      ref: "Engineer",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "shortlisted",
        "won",
        "lost",
        "withdrawn",
      ],
      default: "pending",
    },
    submittedAt: { type: Date, default: Date.now },
    deadline: { type: Date },
    proposal: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IBid>("Bid", BidSchema);

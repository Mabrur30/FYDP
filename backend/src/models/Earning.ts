import mongoose, { Document, Schema } from "mongoose";

export interface IEarning extends Document {
  engineerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  amount: number;
  status: "paid" | "processing" | "pending";
  type: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EarningSchema = new Schema(
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
      enum: ["paid", "processing", "pending"],
      default: "pending",
    },
    type: { type: String, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IEarning>("Earning", EarningSchema);

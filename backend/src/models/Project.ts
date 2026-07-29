import mongoose, { Document, Schema } from "mongoose";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

export interface IProject extends Document {
  title: string;
  description: string;
  location: string;
  budget: number;
  status: "open" | "in_progress" | "completed";
  client_id: mongoose.Types.ObjectId;
  engineer_id?: mongoose.Types.ObjectId | null;
  type?: string;
  ownerId?: string;
  area?: number;
  floors?: string;
  budgetFlexibility?: string;
  duration?: string;
  startDate?: Date;
  endDate?: Date;
  paymentTerms?: string;
  additionalRequirements?: string;
  submissionKey?: string;
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: String,
      required: true,
      enum: BANGLADESH_DISTRICTS,
    },
    budget: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    engineer_id: {
      type: Schema.Types.ObjectId,
      ref: "Engineer",
      default: null,
    },
    type: { type: String },
    ownerId: { type: String },
    area: { type: Number },
    floors: { type: String },
    budgetFlexibility: { type: String },
    duration: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    paymentTerms: { type: String },
    additionalRequirements: { type: String },
    submissionKey: { type: String },
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

ProjectSchema.index(
  { client_id: 1, submissionKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      submissionKey: { $type: "string", $ne: "" },
    },
  },
);

export default mongoose.model<IProject>("Project", ProjectSchema);

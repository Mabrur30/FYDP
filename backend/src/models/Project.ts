import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  ownerId?: string;
  title: string;
  type: string;
  description: string;
  location?: string;
  area?: number;
  floors?: string;
  budget?: number;
  budgetFlexibility?: string;
  startDate?: Date;
  endDate?: Date;
  paymentTerms?: string;
  additionalRequirements?: string;
  attachments: Array<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  status: "draft" | "open" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    ownerId: { type: String },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    area: { type: Number },
    floors: { type: String },
    budget: { type: Number },
    budgetFlexibility: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    paymentTerms: { type: String },
    additionalRequirements: { type: String },
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "open", "in_progress", "completed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProject>("Project", ProjectSchema);

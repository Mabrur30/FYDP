import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  role: "engineer" | "client";
  type: string;
  title: string;
  message: string;
  read: boolean;
  projectId?: string;
  bidId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["engineer", "client"],
      required: true,
      index: true,
    },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false, index: true },
    projectId: { type: String, trim: true },
    bidId: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);

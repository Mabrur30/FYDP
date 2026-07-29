import mongoose, { Document, Schema } from "mongoose";

export type ProjectPhaseStatus =
  | "not_started"
  | "in_progress"
  | "delayed"
  | "awaiting_approval"
  | "completed";

export interface IProjectPhase extends Document {
  project: mongoose.Types.ObjectId;
  name: string;
  order: number;
  status: ProjectPhaseStatus;
  percentComplete: number;
  dueDate: Date;
  completedAt?: Date;
  dependsOn?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectPhaseSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "delayed",
        "awaiting_approval",
        "completed",
      ],
      default: "not_started",
      index: true,
    },
    percentComplete: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
    dependsOn: [{ type: Schema.Types.ObjectId, ref: "ProjectPhase" }],
  },
  { timestamps: true },
);

ProjectPhaseSchema.index({ project: 1, order: 1 }, { unique: true });

export default mongoose.model<IProjectPhase>(
  "ProjectPhase",
  ProjectPhaseSchema,
);

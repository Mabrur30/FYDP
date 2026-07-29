import mongoose, { Document, Schema } from "mongoose";

export interface INetworkPost extends Document {
  authorId: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

const NetworkPostSchema = new Schema(
  {
    authorId: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: String }],
    comments: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<INetworkPost>("NetworkPost", NetworkPostSchema);

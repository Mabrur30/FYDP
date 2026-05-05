import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  type: "engineer" | "client";
  bio?: string;
  title?: string;
  phone?: string;
  location?: string;
  specialization?: string;
  experience?: number;
  specialties?: string[];
  imageUrl?: string;
  hourlyRate?: string;
  rating?: number;
  reviewsCount?: number;
  portfolio?: Array<{
    title: string;
    location: string;
    year: number;
    image: string;
  }>;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  type: { type: String, enum: ["engineer", "client"], default: "engineer" },
  bio: { type: String },
  title: { type: String },
  phone: { type: String },
  location: { type: String },
  specialization: { type: String },
  experience: { type: Number },
  specialties: [{ type: String }],
  imageUrl: { type: String },
  hourlyRate: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  portfolio: [
    {
      title: { type: String },
      location: { type: String },
      year: { type: Number },
      image: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);

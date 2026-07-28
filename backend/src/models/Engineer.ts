import mongoose, { Document, Schema } from "mongoose";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

export interface IEngineer extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  imageUrl?: string;
  hourlyRate?: string;
  location: (typeof BANGLADESH_DISTRICTS)[number];
  experience_years: number;
  is_verified: boolean;
  rating: number;
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EngineerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    bio: { type: String, trim: true },
    specialties: [{ type: String, trim: true }],
    imageUrl: { type: String, trim: true },
    hourlyRate: { type: String, trim: true },
    location: { type: String, required: true, enum: BANGLADESH_DISTRICTS },
    experience_years: { type: Number, required: true, min: 0, default: 0 },
    is_verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEngineer>("Engineer", EngineerSchema);

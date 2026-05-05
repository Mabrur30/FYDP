import mongoose, { Document, Schema } from "mongoose";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: (typeof BANGLADESH_DISTRICTS)[number];
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema(
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
    location: { type: String, required: true, enum: BANGLADESH_DISTRICTS },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IClient>("Client", ClientSchema);

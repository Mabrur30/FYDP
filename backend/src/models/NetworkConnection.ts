import mongoose, { Document, Schema } from "mongoose";

export type NetworkConnectionStatus = "pending" | "accepted";

export interface INetworkConnection extends Document {
  requesterId: string;
  recipientId: string;
  status: NetworkConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NetworkConnectionSchema = new Schema(
  {
    requesterId: { type: String, required: true, index: true },
    recipientId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

NetworkConnectionSchema.index(
  { requesterId: 1, recipientId: 1 },
  { unique: true },
);

export default mongoose.model<INetworkConnection>(
  "NetworkConnection",
  NetworkConnectionSchema,
);

import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage>("Message", MessageSchema);

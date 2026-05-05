import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  participants: string[];
  name: string;
  title: string;
  image: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema(
  {
    participants: [{ type: String, required: true }],
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    online: { type: Boolean, default: false },
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: String, default: "" },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);

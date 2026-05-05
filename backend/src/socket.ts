import { Server } from "socket.io";
import Message from "./models/Message";
import Conversation from "./models/Conversation";

function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("conversation:join", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on(
      "message:send",
      async ({
        conversationId,
        senderId = "0",
        text,
      }: {
        conversationId: string;
        senderId?: string;
        text: string;
      }) => {
        if (!conversationId || !String(text || "").trim()) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const message = await Message.create({
          conversationId,
          senderId: String(senderId),
          text: String(text).trim(),
          timestamp: formatTimestamp(),
          read: false,
        });

        conversation.lastMessage = message.text;
        conversation.lastMessageTime = "Just now";
        conversation.unreadCount = 0;
        await conversation.save();

        const payload = {
          id: String(message._id),
          senderId: Number(message.senderId),
          text: message.text,
          timestamp: message.timestamp,
          read: message.read,
        };

        io.to(`conversation:${conversationId}`).emit("message:new", payload);
      },
    );
  });

  return io;
}

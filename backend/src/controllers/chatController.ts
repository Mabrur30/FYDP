import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

const seededConversations = [
  {
    id: "1",
    userId: 1,
    name: "Mahmud Hasan",
    title: "Senior Structural Engineer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    lastMessage: "I can help with the structural calculations for your project",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    online: true,
    messages: [
      {
        id: 1,
        senderId: 0,
        text: "Hi Mahmud, I saw your profile and I need help with structural calculations for a 10-story building project in Gulshan.",
        timestamp: "10:30 AM",
        read: true,
      },
      {
        id: 2,
        senderId: 1,
        text: "Hello! I'd be happy to help. Can you share more details about the project?",
        timestamp: "10:32 AM",
        read: true,
      },
      {
        id: 3,
        senderId: 0,
        text: "Yes, it's a residential building with a basement parking area. We need complete structural design and analysis.",
        timestamp: "10:35 AM",
        read: true,
      },
      {
        id: 4,
        senderId: 1,
        text: "I can help with the structural calculations for your project",
        timestamp: "10:38 AM",
        read: false,
      },
      {
        id: 5,
        senderId: 1,
        text: "I have experience with similar projects in Dhaka. When do you need this completed?",
        timestamp: "10:38 AM",
        read: false,
      },
    ],
  },
  {
    id: "2",
    userId: 2,
    name: "Sabrina Akter",
    title: "Environmental Engineer",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    lastMessage: "The environmental impact assessment report is ready",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    online: true,
    messages: [
      {
        id: 1,
        senderId: 0,
        text: "Hi Sabrina, can you prepare the environmental impact assessment for our construction project?",
        timestamp: "Yesterday",
        read: true,
      },
      {
        id: 2,
        senderId: 2,
        text: "Sure! I'll need the project details and site location.",
        timestamp: "Yesterday",
        read: true,
      },
      {
        id: 3,
        senderId: 2,
        text: "The environmental impact assessment report is ready",
        timestamp: "1 hour ago",
        read: true,
      },
    ],
  },
];

function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

async function seedConversationIfMissing(conversationId: string) {
  const existing = await Conversation.findById(conversationId);
  if (existing) return existing;

  const fallback = seededConversations.find(
    (conversation) => conversation.id === conversationId,
  );
  if (!fallback) return null;

  return Conversation.create({
    _id: conversationId,
    participants: ["0", String(fallback.userId)],
    name: fallback.name,
    title: fallback.title,
    image: fallback.image,
    online: fallback.online,
    lastMessage: fallback.lastMessage,
    lastMessageTime: fallback.lastMessageTime,
    unreadCount: fallback.unreadCount,
  });
}

function toConversationDTO(conversation: any) {
  return {
    id: String(conversation._id),
    userId: Number(conversation.participants?.[1] || conversation.userId || 0),
    name: conversation.name,
    title: conversation.title,
    image: conversation.image,
    lastMessage: conversation.lastMessage,
    lastMessageTime: conversation.lastMessageTime,
    unreadCount: conversation.unreadCount ?? 0,
    online: conversation.online ?? false,
  };
}

function toMessageDTO(message: any) {
  return {
    id: String(message._id),
    senderId: Number(message.senderId),
    text: message.text,
    timestamp: message.timestamp,
    read: message.read,
  };
}

export async function listConversations(_req: Request, res: Response) {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });

    if (!conversations.length) {
      return res.json(
        seededConversations.map(
          ({ messages: _messages, ...conversation }) => conversation,
        ),
      );
    }

    return res.json(conversations.map(toConversationDTO));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listMessages(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const seeded = seededConversations.find(
      (conversation) => conversation.id === id,
    );

    if (!seeded) {
      const dbMessages = await Message.find({ conversationId: id }).sort({
        createdAt: 1,
      });
      return res.json(dbMessages.map(toMessageDTO));
    }

    const dbMessages = await Message.find({ conversationId: id }).sort({
      createdAt: 1,
    });
    if (!dbMessages.length) {
      return res.json(seeded.messages);
    }

    return res.json(dbMessages.map(toMessageDTO));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function postMessage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { senderId = "0", text = "" } = req.body || {};

    if (!String(text).trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await seedConversationIfMissing(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await Message.create({
      conversationId: id,
      senderId: String(senderId),
      text: String(text).trim(),
      timestamp: formatTimestamp(),
      read: false,
    });

    conversation.lastMessage = message.text;
    conversation.lastMessageTime = "Just now";
    conversation.unreadCount = 0;
    await conversation.save();

    return res.status(201).json(toMessageDTO(message));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

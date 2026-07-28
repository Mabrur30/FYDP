import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import type { AuthRequest } from "../middleware/auth";

function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getParticipantId(req: AuthRequest) {
  return String(req.user?.id || "");
}

function belongsToParticipant(conversation: any, participantId: string) {
  return Boolean(
    participantId &&
    (String(conversation.engineerId || "") === participantId ||
      String(conversation.clientId || "") === participantId ||
      (Array.isArray(conversation.participants) &&
        conversation.participants.some(
          (value: unknown) => String(value) === participantId,
        ))),
  );
}

function toConversationDTO(conversation: any) {
  return {
    id: String(conversation._id),
    userId: String(
      conversation.clientId ||
        conversation.participants?.find(
          (value: unknown) =>
            String(value) !== String(conversation.engineerId || ""),
        ) ||
        "",
    ),
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

export async function listConversations(req: AuthRequest, res: Response) {
  try {
    const participantId = getParticipantId(req);
    const query = participantId
      ? {
          $or: [
            { engineerId: participantId },
            { clientId: participantId },
            { participants: participantId },
          ],
        }
      : {};

    const conversations = await Conversation.find(query).sort({
      updatedAt: -1,
    });

    return res.json(conversations.map(toConversationDTO));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listMessages(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const participantId = getParticipantId(req);
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (participantId && !belongsToParticipant(conversation, participantId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const dbMessages = await Message.find({ conversationId: id }).sort({
      createdAt: 1,
    });

    return res.json(dbMessages.map(toMessageDTO));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function postMessage(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { senderId = req.user?.id || "", text = "" } = req.body || {};

    if (!String(text).trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (
      req.user?.id &&
      !belongsToParticipant(conversation, String(req.user.id))
    ) {
      return res.status(403).json({ message: "Forbidden" });
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

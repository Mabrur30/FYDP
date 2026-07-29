import { Response } from "express";
import Notification from "../models/Notification";
import type { AuthRequest } from "../middleware/auth";

function getAuth(req: AuthRequest) {
  return {
    userId: String(req.user?.id || ""),
    role: String(req.user?.role || ""),
  };
}

export async function listNotifications(req: AuthRequest, res: Response) {
  try {
    const { userId } = getAuth(req);

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter((item) => !item.read).length;

    return res.json({
      unreadCount,
      items: notifications.map((item) => ({
        id: String(item._id),
        type: item.type,
        title: item.title,
        message: item.message,
        read: item.read,
        projectId: item.projectId,
        bidId: item.bidId,
        createdAt: item.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  try {
    const { userId } = getAuth(req);
    const notification = await Notification.findById(req.params.id);

    if (!notification || String(notification.userId) !== userId) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    return res.json({ id: String(notification._id), read: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

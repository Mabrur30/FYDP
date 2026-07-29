import Notification from "../models/Notification";

export async function createNotification(input: {
  userId: string;
  role: "engineer" | "client";
  type: string;
  title: string;
  message: string;
  projectId?: string;
  bidId?: string;
}) {
  if (!input.userId) return null;

  return Notification.create({
    userId: input.userId,
    role: input.role,
    type: input.type,
    title: input.title,
    message: input.message,
    projectId: input.projectId,
    bidId: input.bidId,
    read: false,
  });
}

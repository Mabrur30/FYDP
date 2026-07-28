import { Request, Response } from "express";
import Project from "../models/Project";
import Bid from "../models/Bid";
import Earning from "../models/Earning";

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

function toDateLabel(value: Date | string | undefined) {
  if (!value) return "Not available";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toISOString().slice(0, 10);
}

function mapProjectStatus(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    default:
      return "Review";
  }
}

function mapBidStatus(status: string) {
  switch (status) {
    case "under_review":
      return "Under Review";
    case "shortlisted":
      return "Shortlisted";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return "Pending";
  }
}

function deriveProgress(project: any) {
  if (project.status === "completed") return 100;
  if (project.status === "in_progress") return 65;
  return 40;
}

function ensureEngineerAccess(req: Request, engineerId: string) {
  const userId = String((req as any).user?.id || "");
  return !userId || userId === String(engineerId);
}

export async function getEngineerProjects(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!ensureEngineerAccess(req, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const projects = await Project.find({ engineer_id: id })
      .populate("client_id", "name")
      .sort({ updatedAt: -1 });

    return res.json(
      projects.map((project) => ({
        id: String(project._id),
        name: project.title,
        client:
          typeof project.client_id === "object" && project.client_id
            ? (project.client_id as { name?: string }).name || "Client"
            : "Client",
        status: mapProjectStatus(project.status),
        budget: toCurrency(project.budget),
        progress: (project as any).progress ?? deriveProgress(project),
        deadline: toDateLabel(project.endDate || project.createdAt),
      })),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEngineerBids(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!ensureEngineerAccess(req, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bids = await Bid.find({ engineerId: id })
      .populate({
        path: "projectId",
        populate: { path: "client_id", select: "name" },
      })
      .sort({ submittedAt: -1 });

    return res.json(
      bids.map((bid) => {
        const project = bid.projectId as any;
        return {
          id: String(bid._id),
          project: project?.title || "Project",
          client:
            project?.client_id && typeof project.client_id === "object"
              ? project.client_id.name || "Client"
              : "Client",
          budget: toCurrency(bid.amount),
          deadline: toDateLabel(bid.deadline || project?.endDate),
          status: mapBidStatus(bid.status),
          submitted: toDateLabel(bid.submittedAt),
        };
      }),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEngineerEarnings(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!ensureEngineerAccess(req, id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const earnings = await Earning.find({ engineerId: id })
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    const items = earnings.map((earning) => ({
      id: String(earning._id),
      project:
        typeof earning.projectId === "object" && earning.projectId
          ? (earning.projectId as { title?: string }).title || "Project"
          : "Project",
      type: earning.type,
      amount: toCurrency(earning.amount),
      date: toDateLabel(earning.paidAt || earning.createdAt),
      status:
        earning.status === "paid"
          ? "Paid"
          : earning.status === "processing"
            ? "Processing"
            : "Pending",
    }));

    const total = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const pending = earnings
      .filter((earning) => earning.status !== "paid")
      .reduce((sum, earning) => sum + earning.amount, 0);
    const now = new Date();
    const thisMonth = earnings
      .filter((earning) => {
        const paidAt = earning.paidAt || earning.createdAt;
        return (
          paidAt.getFullYear() === now.getFullYear() &&
          paidAt.getMonth() === now.getMonth()
        );
      })
      .reduce((sum, earning) => sum + earning.amount, 0);

    return res.json({
      summary: {
        total,
        thisMonth,
        pending,
      },
      items,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

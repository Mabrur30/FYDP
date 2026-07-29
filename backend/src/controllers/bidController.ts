import { Request, Response } from "express";
import Bid from "../models/Bid";
import Project from "../models/Project";
import type { AuthRequest } from "../middleware/auth";
import { createNotification } from "../utils/notifications";

function getAuth(req: AuthRequest) {
  return {
    userId: String(req.user?.id || ""),
    role: String(req.user?.role || ""),
  };
}

function toBidDTO(bid: any) {
  const project =
    bid.projectId && typeof bid.projectId === "object" ? bid.projectId : null;
  const client =
    project?.client_id && typeof project.client_id === "object"
      ? project.client_id
      : null;

  return {
    id: String(bid._id),
    engineerId: String(bid.engineerId),
    projectId: project ? String(project._id) : String(bid.projectId),
    projectTitle: project?.title || "Project",
    clientName: client?.name || "Client",
    amount: Number(bid.amount || 0),
    status: String(bid.status || "pending"),
    submittedAt: bid.submittedAt,
    deadline: bid.deadline,
    proposal: bid.proposal || "",
  };
}

export async function listEngineerBids(req: AuthRequest, res: Response) {
  try {
    const { engineerId } = req.params;
    const auth = getAuth(req);

    if (auth.role !== "engineer" || auth.userId !== String(engineerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bids = await Bid.find({ engineerId })
      .populate({
        path: "projectId",
        populate: { path: "client_id", select: "name" },
      })
      .sort({ submittedAt: -1 });

    return res.json(bids.map(toBidDTO));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listProjectBids(req: AuthRequest, res: Response) {
  try {
    const { projectId } = req.params;
    const auth = getAuth(req);

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const ownerClientId = String(project.client_id || project.ownerId || "");
    if (auth.role !== "client" || auth.userId !== ownerClientId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bids = await Bid.find({ projectId })
      .populate("engineerId", "name specialization title")
      .sort({ amount: 1, submittedAt: 1 });

    return res.json(
      bids.map((bid) => ({
        id: String(bid._id),
        engineerId:
          bid.engineerId && typeof bid.engineerId === "object"
            ? String((bid.engineerId as any)._id)
            : String(bid.engineerId),
        engineerName:
          bid.engineerId && typeof bid.engineerId === "object"
            ? (bid.engineerId as any).name || "Engineer"
            : "Engineer",
        engineerTitle:
          bid.engineerId && typeof bid.engineerId === "object"
            ? (bid.engineerId as any).title ||
              (bid.engineerId as any).specialization ||
              "Civil Engineer"
            : "Civil Engineer",
        amount: Number(bid.amount || 0),
        status: bid.status,
        proposal: bid.proposal || "",
        deadline: bid.deadline,
        submittedAt: bid.submittedAt,
      })),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBid(req: AuthRequest, res: Response) {
  try {
    const auth = getAuth(req);
    if (auth.role !== "engineer") {
      return res
        .status(403)
        .json({ message: "Only engineers can submit bids" });
    }

    const { projectId, amount, proposal, deadline } = req.body || {};
    if (!projectId || amount === undefined || amount === null) {
      return res
        .status(400)
        .json({ message: "projectId and amount are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status !== "open") {
      return res
        .status(400)
        .json({ message: "Bids are only allowed for open projects" });
    }

    const existing = await Bid.findOne({
      engineerId: auth.userId,
      projectId,
      status: { $ne: "withdrawn" },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already submitted a bid for this project" });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    const bid = await Bid.create({
      engineerId: auth.userId,
      projectId,
      amount: parsedAmount,
      proposal: String(proposal || "").trim(),
      deadline: deadline ? new Date(String(deadline)) : undefined,
      status: "pending",
      submittedAt: new Date(),
    });

    await createNotification({
      userId: String(project.client_id || project.ownerId || ""),
      role: "client",
      type: "bid_submitted",
      title: "New bid received",
      message: `A new bid was submitted for ${project.title}.`,
      projectId: String(project._id),
      bidId: String(bid._id),
    });

    return res.status(201).json(toBidDTO(bid));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBid(req: AuthRequest, res: Response) {
  try {
    const auth = getAuth(req);
    if (auth.role !== "engineer") {
      return res
        .status(403)
        .json({ message: "Only engineers can update bids" });
    }

    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (String(bid.engineerId) !== auth.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !["pending", "under_review", "shortlisted"].includes(String(bid.status))
    ) {
      return res
        .status(400)
        .json({ message: "This bid can no longer be edited" });
    }

    const nextAmount =
      req.body?.amount !== undefined ? Number(req.body.amount) : undefined;
    if (
      nextAmount !== undefined &&
      (!Number.isFinite(nextAmount) || nextAmount <= 0)
    ) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    if (nextAmount !== undefined) bid.amount = nextAmount;
    if (req.body?.proposal !== undefined)
      bid.proposal = String(req.body.proposal || "").trim();
    if (req.body?.deadline !== undefined) {
      bid.deadline = req.body.deadline
        ? new Date(String(req.body.deadline))
        : undefined;
    }

    await bid.save();
    return res.json(toBidDTO(bid));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function withdrawBid(req: AuthRequest, res: Response) {
  try {
    const auth = getAuth(req);
    if (auth.role !== "engineer") {
      return res
        .status(403)
        .json({ message: "Only engineers can withdraw bids" });
    }

    const bid = await Bid.findById(req.params.id).populate(
      "projectId",
      "title client_id ownerId",
    );
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (String(bid.engineerId) !== auth.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !["pending", "under_review", "shortlisted"].includes(String(bid.status))
    ) {
      return res
        .status(400)
        .json({ message: "This bid can no longer be withdrawn" });
    }

    bid.status = "withdrawn" as any;
    await bid.save();

    const project: any = bid.projectId;
    await createNotification({
      userId: String(project?.client_id || project?.ownerId || ""),
      role: "client",
      type: "bid_withdrawn",
      title: "Bid withdrawn",
      message: `A bid was withdrawn for ${project?.title || "your project"}.`,
      projectId: project?._id ? String(project._id) : undefined,
      bidId: String(bid._id),
    });

    return res.json({ id: String(bid._id), status: bid.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function awardBid(req: AuthRequest, res: Response) {
  try {
    const auth = getAuth(req);
    if (auth.role !== "client") {
      return res.status(403).json({ message: "Only clients can award bids" });
    }

    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const project = await Project.findById(bid.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const ownerClientId = String(project.client_id || project.ownerId || "");
    if (auth.userId !== ownerClientId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (project.status === "completed") {
      return res.status(400).json({ message: "Project is already completed" });
    }

    await Bid.updateMany(
      {
        projectId: project._id,
        _id: { $ne: bid._id },
        status: { $in: ["pending", "under_review", "shortlisted"] },
      },
      { $set: { status: "lost" } },
    );

    bid.status = "won";
    await bid.save();

    project.engineer_id = bid.engineerId as any;
    project.status = "in_progress";
    await project.save();

    await createNotification({
      userId: String(bid.engineerId),
      role: "engineer",
      type: "bid_awarded",
      title: "Bid awarded",
      message: `Your bid was awarded for ${project.title}.`,
      projectId: String(project._id),
      bidId: String(bid._id),
    });

    const rejectedBids = await Bid.find({
      projectId: project._id,
      status: "lost",
    });
    await Promise.all(
      rejectedBids.map((item) =>
        createNotification({
          userId: String(item.engineerId),
          role: "engineer",
          type: "bid_not_selected",
          title: "Bid not selected",
          message: `Another bid was selected for ${project.title}.`,
          projectId: String(project._id),
          bidId: String(item._id),
        }),
      ),
    );

    return res.json({
      bidId: String(bid._id),
      projectId: String(project._id),
      projectStatus: project.status,
      assignedEngineerId: String(project.engineer_id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

import { Request, Response } from "express";
import Project, { IProject } from "../models/Project";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";
import Bid from "../models/Bid";
import Earning from "../models/Earning";
import ProjectPhase, { ProjectPhaseStatus } from "../models/ProjectPhase";
import type { AuthRequest } from "../middleware/auth";
import { createNotification } from "../utils/notifications";
import { ProjectProgressResponse } from "../types/progress";

function parseNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

type ProjectBody = {
  title?: string;
  description?: string;
  location?: string;
  budget?: unknown;
  status?: "open" | "in_progress" | "completed";
  client_id?: string;
  engineer_id?: string | null;
  ownerId?: string;
  type?: string;
  area?: unknown;
  floors?: string;
  budgetFlexibility?: string;
  duration?: string;
  startDate?: unknown;
  endDate?: unknown;
  paymentTerms?: string;
  additionalRequirements?: string;
  submissionKey?: string;
  attachments?: Array<{
    filename?: string;
    originalName?: string;
    mimeType?: string;
    size?: unknown;
    url?: string;
  }>;
};

function parseDate(value: unknown) {
  if (!value) return undefined;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toProjectDTO(project: IProject | null) {
  if (!project) return null;

  return {
    id: String(project._id),
    title: project.title,
    description: project.description,
    location: project.location,
    budget: project.budget,
    status: project.status,
    client_id: project.client_id,
    engineer_id: project.engineer_id,
    type: project.type,
    ownerId: project.ownerId,
    area: project.area,
    floors: project.floors,
    budgetFlexibility: project.budgetFlexibility,
    duration: project.duration,
    startDate: project.startDate,
    endDate: project.endDate,
    paymentTerms: project.paymentTerms,
    additionalRequirements: project.additionalRequirements,
    attachments: project.attachments || [],
    created_at: (project as unknown as { created_at?: Date }).created_at,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function canAccessProject(req: AuthRequest, project: IProject) {
  const actorId = String(req.user?.id || "");
  const actorRole = String(req.user?.role || "");
  const clientId = String(project.client_id || project.ownerId || "");
  const engineerId = project.engineer_id ? String(project.engineer_id) : "";

  const isClientOwner = actorRole === "client" && actorId === clientId;
  const isAssignedEngineer =
    actorRole === "engineer" && engineerId && actorId === engineerId;

  return { isClientOwner, isAssignedEngineer, clientId, engineerId };
}

function isProjectPhaseStatus(value: string): value is ProjectPhaseStatus {
  return [
    "not_started",
    "in_progress",
    "delayed",
    "awaiting_approval",
    "completed",
  ].includes(value);
}

function toPhaseDTO(phase: {
  _id: unknown;
  name: string;
  order: number;
  status: ProjectPhaseStatus;
  percentComplete: number;
  dueDate: Date;
  completedAt?: Date;
}) {
  return {
    id: String(phase._id),
    name: phase.name,
    order: phase.order,
    status: phase.status,
    percentComplete: phase.percentComplete,
    dueDate: phase.dueDate.toISOString(),
    completedAt: phase.completedAt ? phase.completedAt.toISOString() : null,
  };
}

async function ensureDefaultProjectPhases(project: IProject) {
  const existing = await ProjectPhase.countDocuments({ project: project._id });
  if (existing > 0) return;

  const now = new Date();
  const dueBase = parseDate(project.endDate) || now;
  const msPerDay = 24 * 60 * 60 * 1000;

  await ProjectPhase.insertMany([
    {
      project: project._id,
      name: "Planning and mobilization",
      order: 1,
      status: "not_started",
      percentComplete: 0,
      dueDate: new Date(dueBase.getTime() - 60 * msPerDay),
    },
    {
      project: project._id,
      name: "Execution and supervision",
      order: 2,
      status: "not_started",
      percentComplete: 0,
      dueDate: new Date(dueBase.getTime() - 30 * msPerDay),
    },
    {
      project: project._id,
      name: "Final handover",
      order: 3,
      status: "not_started",
      percentComplete: 0,
      dueDate: dueBase,
    },
  ]);
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const actorId = String(req.user?.id || "");
    const actorRole = String(req.user?.role || "");
    if (!actorId || actorRole !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can create projects" });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const body = (req.body || {}) as ProjectBody;
    const submissionKey = String(
      req.header("x-idempotency-key") || body.submissionKey || "",
    ).trim();
    const clientId = actorId;

    if (submissionKey) {
      const existingProject = await Project.findOne({
        client_id: clientId,
        submissionKey,
      });
      if (existingProject) {
        return res.status(200).json(toProjectDTO(existingProject));
      }
    }

    const uploadedAttachments = files.map((file: any) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const providedAttachments = Array.isArray(body.attachments)
      ? body.attachments
          .map((attachment) => ({
            filename: String(attachment.filename || "").trim(),
            originalName: String(attachment.originalName || "").trim(),
            mimeType: String(attachment.mimeType || "").trim(),
            size: parseNumber(attachment.size),
            url: String(attachment.url || "").trim(),
          }))
          .filter(
            (attachment) =>
              attachment.filename &&
              attachment.originalName &&
              attachment.mimeType &&
              attachment.url &&
              typeof attachment.size === "number",
          )
      : [];

    if (
      !body.title ||
      !body.description ||
      !body.location ||
      clientId == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      !BANGLADESH_DISTRICTS.includes(
        body.location as (typeof BANGLADESH_DISTRICTS)[number],
      )
    ) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const project = await Project.create({
      ownerId: actorId,
      title: body.title,
      type: body.type,
      description: body.description,
      location: body.location,
      area: parseNumber(body.area),
      floors: body.floors,
      budget: parseNumber(body.budget),
      budgetFlexibility: body.budgetFlexibility,
      duration: body.duration,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      paymentTerms: body.paymentTerms,
      additionalRequirements: body.additionalRequirements,
      submissionKey: submissionKey || undefined,
      client_id: clientId,
      engineer_id: body.engineer_id || null,
      attachments: uploadedAttachments.length
        ? uploadedAttachments
        : providedAttachments,
      status: body.status || "open",
    });

    return res.status(201).json(toProjectDTO(project));
  } catch (err: any) {
    if (err?.code === 11000 && err?.keyPattern?.submissionKey) {
      const actorId = String(req.user?.id || "");
      const body = (req.body || {}) as ProjectBody;
      const submissionKey = String(
        req.header("x-idempotency-key") || body.submissionKey || "",
      ).trim();

      if (actorId && submissionKey) {
        const existingProject = await Project.findOne({
          client_id: actorId,
          submissionKey,
        });
        if (existingProject) {
          return res.status(200).json(toProjectDTO(existingProject));
        }
      }
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listProjects(_req: Request, res: Response) {
  try {
    const req = _req as AuthRequest;
    const actorId = String(req.user?.id || "");
    const actorRole = String(req.user?.role || "");

    if (!actorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let query: Record<string, unknown> = {};

    if (actorRole === "client") {
      query = {
        $or: [{ client_id: actorId }, { ownerId: actorId }],
      };
    } else if (actorRole === "engineer") {
      query = {
        $or: [{ status: "open" }, { engineer_id: actorId }],
      };
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return res.json(projects.map((project) => toProjectDTO(project)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const actorId = String(req.user?.id || "");
    const actorRole = String(req.user?.role || "");
    const { isClientOwner, isAssignedEngineer } = canAccessProject(
      req,
      project,
    );
    const isOpenProjectForEngineer =
      actorRole === "engineer" && project.status === "open";

    if (
      !actorId ||
      (!isClientOwner && !isAssignedEngineer && !isOpenProjectForEngineer)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(toProjectDTO(project));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProjectById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isClientOwner } = canAccessProject(req, project);
    if (!isClientOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const body = (req.body || {}) as ProjectBody;
    const updates: Record<string, unknown> = {
      title: body.title,
      description: body.description,
      location: body.location,
      budget: parseNumber(body.budget),
      status: body.status,
      engineer_id: body.engineer_id,
      type: body.type,
      area: parseNumber(body.area),
      floors: body.floors,
      budgetFlexibility: body.budgetFlexibility,
      duration: body.duration,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      paymentTerms: body.paymentTerms,
      additionalRequirements: body.additionalRequirements,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    return res.json(toProjectDTO(updatedProject));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProjectById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existingProject = await Project.findById(id);
    if (!existingProject)
      return res.status(404).json({ message: "Project not found" });

    const { isClientOwner } = canAccessProject(req, existingProject);
    if (!isClientOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Project.findByIdAndDelete(id);

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProjectStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const nextStatus = String(req.body?.status || "").trim() as
      | "open"
      | "in_progress"
      | "completed";

    if (!["open", "in_progress", "completed"].includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isClientOwner, isAssignedEngineer, clientId, engineerId } =
      canAccessProject(req, project);

    if (!isClientOwner && !isAssignedEngineer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const currentStatus = project.status;
    if (currentStatus === nextStatus) {
      return res.json(toProjectDTO(project));
    }

    if (currentStatus === "open" && nextStatus === "in_progress") {
      if (!isClientOwner) {
        return res
          .status(403)
          .json({ message: "Only project owner can start this project" });
      }
      if (!engineerId) {
        return res.status(400).json({
          message: "Project needs an awarded engineer before starting",
        });
      }
    } else if (currentStatus === "in_progress" && nextStatus === "completed") {
      // allowed for client owner or assigned engineer
    } else {
      return res.status(400).json({
        message: `Invalid transition from ${currentStatus} to ${nextStatus}`,
      });
    }

    project.status = nextStatus;
    await project.save();

    if (nextStatus === "in_progress") {
      await ensureDefaultProjectPhases(project);
    }

    if (nextStatus === "completed" && engineerId) {
      const existingEarning = await Earning.findOne({
        projectId: project._id,
        engineerId,
      });

      if (!existingEarning) {
        const winningBid = await Bid.findOne({
          projectId: project._id,
          engineerId,
          status: "won",
        });

        const amount = Number(winningBid?.amount || project.budget || 0);

        if (amount > 0) {
          await Earning.create({
            engineerId,
            projectId: project._id,
            amount,
            status: "processing",
            type: "Project Completion",
          });
        }
      }
    }

    const statusLabel = nextStatus.replace("_", " ");

    if (engineerId) {
      await createNotification({
        userId: engineerId,
        role: "engineer",
        type: "project_status_changed",
        title: "Project status updated",
        message: `${project.title} is now ${statusLabel}.`,
        projectId: String(project._id),
      });
    }

    await createNotification({
      userId: clientId,
      role: "client",
      type: "project_status_changed",
      title: "Project status updated",
      message: `${project.title} is now ${statusLabel}.`,
      projectId: String(project._id),
    });

    return res.json(toProjectDTO(project));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectProgress(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isClientOwner, isAssignedEngineer } = canAccessProject(
      req,
      project,
    );
    if (!isClientOwner && !isAssignedEngineer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const phases = await ProjectPhase.find({ project: project._id }).sort({
      order: 1,
    });

    const percentSum = phases.reduce(
      (sum, phase) => sum + phase.percentComplete,
      0,
    );
    // Future option: weighted average by per-phase budget once Project supports phase-level budget allocation.
    const overallPercentComplete = phases.length
      ? Math.round(percentSum / phases.length)
      : 0;

    const response: ProjectProgressResponse = {
      projectId: String(project._id),
      overallStatus: project.status,
      overallPercentComplete,
      phases: phases.map((phase) => toPhaseDTO(phase)),
    };

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

type UpdatePhaseBody = {
  status?: ProjectPhaseStatus;
  percentComplete?: unknown;
  dueDate?: unknown;
  name?: string;
};

type CreatePhaseBody = {
  name?: string;
  order?: unknown;
  status?: ProjectPhaseStatus;
  percentComplete?: unknown;
  dueDate?: unknown;
  dependsOn?: string[];
};

export async function listProjectPhases(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isClientOwner, isAssignedEngineer } = canAccessProject(
      req,
      project,
    );
    if (!isClientOwner && !isAssignedEngineer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const phases = await ProjectPhase.find({ project: project._id }).sort({
      order: 1,
    });

    return res.json(phases.map((phase) => toPhaseDTO(phase)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProjectPhase(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isClientOwner } = canAccessProject(req, project);
    if (!isClientOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const body = (req.body || {}) as CreatePhaseBody;
    const name = String(body.name || "").trim();
    const nextStatusRaw = body.status ? String(body.status) : undefined;
    const requestedStatus =
      nextStatusRaw && isProjectPhaseStatus(nextStatusRaw)
        ? nextStatusRaw
        : undefined;
    const nextPercent = parseNumber(body.percentComplete);
    const nextDueDate = parseDate(body.dueDate);
    const requestedOrder = parseNumber(body.order);

    if (!name) {
      return res.status(400).json({ message: "Phase name is required" });
    }
    if (nextStatusRaw && !requestedStatus) {
      return res.status(400).json({ message: "Invalid phase status" });
    }
    if (nextPercent !== undefined && (nextPercent < 0 || nextPercent > 100)) {
      return res
        .status(400)
        .json({ message: "percentComplete must be between 0 and 100" });
    }
    if (!nextDueDate) {
      return res.status(400).json({ message: "Valid dueDate is required" });
    }

    const maxOrderPhase = await ProjectPhase.findOne({ project: project._id })
      .sort({ order: -1 })
      .select("order");
    const nextOrder =
      requestedOrder !== undefined && requestedOrder >= 0
        ? requestedOrder
        : Number(maxOrderPhase?.order || 0) + 1;

    const dependsOn = Array.isArray(body.dependsOn)
      ? body.dependsOn
          .map((phaseId) => String(phaseId || "").trim())
          .filter(Boolean)
      : [];

    const phase = await ProjectPhase.create({
      project: project._id,
      name,
      order: nextOrder,
      status: requestedStatus || "not_started",
      percentComplete: nextPercent ?? 0,
      dueDate: nextDueDate,
      completedAt:
        requestedStatus === "completed" || nextPercent === 100
          ? new Date()
          : undefined,
      dependsOn,
    });

    return res.status(201).json(toPhaseDTO(phase));
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({
        message: "A phase with the same order already exists for this project",
      });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProjectPhase(req: AuthRequest, res: Response) {
  try {
    const { id, phaseId } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { isAssignedEngineer, clientId, engineerId } = canAccessProject(
      req,
      project,
    );
    if (!isAssignedEngineer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const phase = await ProjectPhase.findOne({
      _id: phaseId,
      project: project._id,
    });
    if (!phase)
      return res.status(404).json({ message: "Project phase not found" });

    const body = (req.body || {}) as UpdatePhaseBody;
    const nextStatusRaw = body.status ? String(body.status) : undefined;
    const requestedStatus =
      nextStatusRaw && isProjectPhaseStatus(nextStatusRaw)
        ? nextStatusRaw
        : undefined;
    const nextPercent = parseNumber(body.percentComplete);
    const nextDueDate = parseDate(body.dueDate);

    if (nextStatusRaw && !requestedStatus) {
      return res.status(400).json({ message: "Invalid phase status" });
    }

    if (body.percentComplete !== undefined && nextPercent === undefined) {
      return res.status(400).json({ message: "Invalid percentComplete" });
    }

    if (nextPercent !== undefined && (nextPercent < 0 || nextPercent > 100)) {
      return res
        .status(400)
        .json({ message: "percentComplete must be between 0 and 100" });
    }

    if (body.dueDate !== undefined && nextDueDate === undefined) {
      return res.status(400).json({ message: "Invalid dueDate" });
    }

    const previousStatus = phase.status;

    if (requestedStatus) {
      phase.status = requestedStatus;
      if (requestedStatus === "completed") {
        phase.completedAt = new Date();
        if (phase.percentComplete < 100) phase.percentComplete = 100;
      }
      if (requestedStatus !== "completed") {
        phase.completedAt = undefined;
      }
    }

    if (typeof body.name === "string" && body.name.trim()) {
      phase.name = body.name.trim();
    }

    if (nextPercent !== undefined) {
      phase.percentComplete = nextPercent;
      if (nextPercent === 100 && phase.status !== "completed") {
        phase.status = "completed";
        phase.completedAt = new Date();
      }
    }

    if (nextDueDate) {
      phase.dueDate = nextDueDate;
    }

    await phase.save();

    const updatedStatus = phase.status;
    const shouldNotify =
      previousStatus !== updatedStatus &&
      ["completed", "delayed", "awaiting_approval"].includes(updatedStatus);

    if (shouldNotify) {
      const statusLabel = updatedStatus.replace("_", " ");

      if (engineerId) {
        await createNotification({
          userId: engineerId,
          role: "engineer",
          type: "project_status_changed",
          title: "Project phase updated",
          message: `${project.title}: phase \"${phase.name}\" is now ${statusLabel}.`,
          projectId: String(project._id),
        });
      }

      await createNotification({
        userId: clientId,
        role: "client",
        type: "project_status_changed",
        title: "Project phase updated",
        message: `${project.title}: phase \"${phase.name}\" is now ${statusLabel}.`,
        projectId: String(project._id),
      });
    }

    return res.json(toPhaseDTO(phase));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

import { Request, Response } from "express";
import Project, { IProject } from "../models/Project";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

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
  startDate?: unknown;
  endDate?: unknown;
  paymentTerms?: string;
  additionalRequirements?: string;
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

export async function createProject(req: Request, res: Response) {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const body = (req.body || {}) as ProjectBody;
    const clientId = body.client_id || body.ownerId;

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
      ownerId: body.ownerId,
      title: body.title,
      type: body.type,
      description: body.description,
      location: body.location,
      area: parseNumber(body.area),
      floors: body.floors,
      budget: parseNumber(body.budget),
      budgetFlexibility: body.budgetFlexibility,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      paymentTerms: body.paymentTerms,
      additionalRequirements: body.additionalRequirements,
      client_id: clientId,
      engineer_id: body.engineer_id || null,
      attachments: files.map((file: any) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      })),
      status: body.status || "open",
    });

    return res.status(201).json(toProjectDTO(project));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listProjects(_req: Request, res: Response) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects.map((project) => toProjectDTO(project)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.json(toProjectDTO(project));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const body = (req.body || {}) as ProjectBody;
    const updates: Record<string, unknown> = {
      title: body.title,
      description: body.description,
      location: body.location,
      budget: parseNumber(body.budget),
      status: body.status,
      client_id: body.client_id,
      engineer_id: body.engineer_id,
      ownerId: body.ownerId,
      type: body.type,
      area: parseNumber(body.area),
      floors: body.floors,
      budgetFlexibility: body.budgetFlexibility,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      paymentTerms: body.paymentTerms,
      additionalRequirements: body.additionalRequirements,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.json(toProjectDTO(project));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

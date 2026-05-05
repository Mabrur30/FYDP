import { Request, Response } from "express";
import Project from "../models/Project";

function parseNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseDate(value: unknown) {
  if (!value) return undefined;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function createProject(req: Request, res: Response) {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    const body = req.body || {};

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
      attachments: files.map((file: any) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      })),
      status: body.status || "open",
    });

    return res.status(201).json({
      id: String(project._id),
      title: project.title,
      type: project.type,
      description: project.description,
      location: project.location,
      area: project.area,
      floors: project.floors,
      budget: project.budget,
      budgetFlexibility: project.budgetFlexibility,
      startDate: project.startDate,
      endDate: project.endDate,
      paymentTerms: project.paymentTerms,
      additionalRequirements: project.additionalRequirements,
      attachments: project.attachments,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listProjects(_req: Request, res: Response) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(
      projects.map((project) => ({
        id: String(project._id),
        title: project.title,
        type: project.type,
        description: project.description,
        location: project.location,
        area: project.area,
        floors: project.floors,
        budget: project.budget,
        budgetFlexibility: project.budgetFlexibility,
        startDate: project.startDate,
        endDate: project.endDate,
        paymentTerms: project.paymentTerms,
        additionalRequirements: project.additionalRequirements,
        attachments: project.attachments,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
    );
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

    return res.json({
      id: String(project._id),
      title: project.title,
      type: project.type,
      description: project.description,
      location: project.location,
      area: project.area,
      floors: project.floors,
      budget: project.budget,
      budgetFlexibility: project.budgetFlexibility,
      startDate: project.startDate,
      endDate: project.endDate,
      paymentTerms: project.paymentTerms,
      additionalRequirements: project.additionalRequirements,
      attachments: project.attachments,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

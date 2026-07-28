import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Engineer, { IEngineer } from "../models/Engineer";
import Project from "../models/Project";
import Review from "../models/Review";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

type EngineerBody = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  specialization?: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  imageUrl?: string;
  hourlyRate?: string;
  location?: string;
  experience_years?: unknown;
  is_verified?: boolean;
  rating?: unknown;
};

function parseNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toEngineerDTO(engineer: IEngineer | null) {
  if (!engineer) return null;

  return {
    id: String(engineer._id),
    name: engineer.name,
    email: engineer.email,
    phone: engineer.phone,
    specialization: engineer.specialization,
    title: engineer.title,
    bio: engineer.bio,
    specialties: engineer.specialties || [],
    imageUrl: engineer.imageUrl,
    hourlyRate: engineer.hourlyRate,
    location: engineer.location,
    experience_years: engineer.experience_years,
    is_verified: engineer.is_verified,
    rating: engineer.rating,
    created_at: (engineer as unknown as { created_at?: Date }).created_at,
    createdAt: engineer.createdAt,
    updatedAt: engineer.updatedAt,
  };
}

export async function createEngineer(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as EngineerBody;

    if (
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.password ||
      !body.specialization ||
      !body.location
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

    const password = await bcrypt.hash(body.password, 10);
    const engineer = await Engineer.create({
      ...body,
      password,
      experience_years: parseNumber(body.experience_years) ?? 0,
      rating: parseNumber(body.rating) ?? 0,
      is_verified: body.is_verified ?? false,
      specialties: Array.isArray(body.specialties) ? body.specialties : [],
    });

    return res.status(201).json(toEngineerDTO(engineer));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listEngineers(_req: Request, res: Response) {
  try {
    const engineers = await Engineer.find().sort({ createdAt: -1 });
    return res.json(engineers.map((engineer) => toEngineerDTO(engineer)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEngineerById(req: Request, res: Response) {
  try {
    const engineer = await Engineer.findById(req.params.id);
    if (!engineer)
      return res.status(404).json({ message: "Engineer not found" });
    return res.json(toEngineerDTO(engineer));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEngineerProfile(req: Request, res: Response) {
  try {
    const engineer = await Engineer.findById(req.params.id);
    if (!engineer)
      return res.status(404).json({ message: "Engineer not found" });

    const [projects, reviews] = await Promise.all([
      Project.find({ engineer_id: engineer._id }).sort({ createdAt: -1 }),
      Review.find({ engineer_id: engineer._id })
        .sort({ createdAt: -1 })
        .populate("client_id", "name")
        .populate("project_id", "title location"),
    ]);

    const completedProjects = projects.filter(
      (project) => project.status === "completed",
    ).length;
    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : engineer.rating;

    return res.json({
      engineer: toEngineerDTO(engineer),
      summary:
        engineer.bio ||
        `Experienced ${engineer.specialization} engineer based in ${engineer.location} with ${engineer.experience_years} years of experience.`,
      stats: {
        totalProjects: projects.length,
        completedProjects,
        reviewCount,
        averageRating,
        successRate: projects.length
          ? Math.round((completedProjects / projects.length) * 100)
          : 0,
        memberSince: engineer.createdAt,
      },
      projects: projects.slice(0, 6).map((project) => ({
        id: String(project._id),
        title: project.title,
        location: project.location,
        year: project.createdAt.getFullYear(),
        status: project.status,
      })),
      reviews: reviews.slice(0, 6).map((review) => ({
        id: String(review._id),
        client:
          typeof review.client_id === "object" && review.client_id
            ? (review.client_id as { name?: string }).name || "Client"
            : "Client",
        project:
          typeof review.project_id === "object" && review.project_id
            ? (review.project_id as { title?: string }).title || "Project"
            : "Project",
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateEngineerById(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as EngineerBody;
    const updates: Record<string, unknown> = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialization: body.specialization,
      title: body.title,
      bio: body.bio,
      specialties: body.specialties,
      imageUrl: body.imageUrl,
      hourlyRate: body.hourlyRate,
      location: body.location,
      experience_years: parseNumber(body.experience_years),
      is_verified: body.is_verified,
      rating: parseNumber(body.rating),
    };

    if (body.password) {
      updates.password = await bcrypt.hash(body.password, 10);
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const engineer = await Engineer.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!engineer)
      return res.status(404).json({ message: "Engineer not found" });
    return res.json(toEngineerDTO(engineer));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteEngineerById(req: Request, res: Response) {
  try {
    const engineer = await Engineer.findByIdAndDelete(req.params.id);
    if (!engineer)
      return res.status(404).json({ message: "Engineer not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

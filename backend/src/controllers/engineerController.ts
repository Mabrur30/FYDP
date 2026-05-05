import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Engineer, { IEngineer } from "../models/Engineer";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

type EngineerBody = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  specialization?: string;
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

export async function updateEngineerById(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as EngineerBody;
    const updates: Record<string, unknown> = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialization: body.specialization,
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

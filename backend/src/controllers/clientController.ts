import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Client, { IClient } from "../models/Client";
import { BANGLADESH_DISTRICTS } from "../utils/bangladeshDistricts";

type ClientBody = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  location?: string;
};

function toClientDTO(client: IClient | null) {
  if (!client) return null;

  return {
    id: String(client._id),
    name: client.name,
    email: client.email,
    phone: client.phone,
    location: client.location,
    created_at: (client as unknown as { created_at?: Date }).created_at,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

export async function createClient(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as ClientBody;

    if (
      !body.name ||
      !body.email ||
      !body.phone ||
      !body.password ||
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
    const client = await Client.create({
      ...body,
      password,
    });

    return res.status(201).json(toClientDTO(client));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listClients(_req: Request, res: Response) {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    return res.json(clients.map((client) => toClientDTO(client)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getClientById(req: Request, res: Response) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.json(toClientDTO(client));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateClientById(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as ClientBody;
    const updates: Record<string, unknown> = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      location: body.location,
    };

    if (body.password) {
      updates.password = await bcrypt.hash(body.password, 10);
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.json(toClientDTO(client));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteClientById(req: Request, res: Response) {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

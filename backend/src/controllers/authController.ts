import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Engineer from "../models/Engineer";
import Client from "../models/Client";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const TOKEN_EXPIRES = "7d";

function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

function sanitizeUser(user: any) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

export async function registerEngineer(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      location,
      experience_years,
    } = req.body;

    if (!name || !email || !phone || !password || !specialization || !location)
      return res.status(400).json({ message: "Missing required fields" });

    const hashed = await bcrypt.hash(password, 10);
    const engineer = await Engineer.create({
      name,
      email,
      phone,
      password: hashed,
      specialization,
      location,
      experience_years: experience_years || 0,
    });

    const token = generateToken({ id: engineer._id, role: "engineer" });
    return res.status(201).json({ token, user: sanitizeUser(engineer) });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function registerClient(req: Request, res: Response) {
  try {
    const { name, email, phone, password, location } = req.body;
    if (!name || !email || !phone || !password || !location)
      return res.status(400).json({ message: "Missing required fields" });

    const hashed = await bcrypt.hash(password, 10);
    const client = await Client.create({
      name,
      email,
      phone,
      password: hashed,
      location,
    });

    const token = generateToken({ id: client._id, role: "client" });
    return res.status(201).json({ token, user: sanitizeUser(client) });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });

    let user: any = null;
    if (role === "engineer") {
      user = await Engineer.findOne({ email });
    } else if (role === "client") {
      user = await Client.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role });
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default { registerEngineer, registerClient, login };
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password, type } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash,
      type: type || "engineer",
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

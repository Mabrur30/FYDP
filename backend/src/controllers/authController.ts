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
    return res
      .status(201)
      .json({
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

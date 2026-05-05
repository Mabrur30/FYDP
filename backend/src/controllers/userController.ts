import { Request, Response } from "express";
import User from "../models/User";

const sampleEngineers = [
  {
    id: "sample-1",
    name: "Ahmed Khan",
    title: "Structural Engineer",
    rating: 4.8,
    reviews: 127,
    experience: 12,
    location: "Dhaka",
    specialties: ["RCC Design", "Foundation", "High-Rise"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,500-3,500",
  },
  {
    id: "sample-2",
    name: "Fatima Rahman",
    title: "Geotechnical Engineer",
    rating: 4.9,
    reviews: 94,
    experience: 10,
    location: "Chittagong",
    specialties: ["Soil Testing", "Foundation Design", "Site Investigation"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,000-2,800",
  },
];

function toEngineerDTO(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    title:
      user.title ||
      (user.specialization
        ? `${user.specialization} Engineer`
        : "Civil Engineer"),
    rating: user.rating ?? 0,
    reviews: user.reviewsCount ?? 0,
    experience: user.experience ?? 0,
    location: user.location || "",
    specialties: user.specialties || [],
    image:
      user.imageUrl ||
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: user.hourlyRate || "",
  };
}

export async function listEngineers(req: Request, res: Response) {
  try {
    const { q, location, specialization } = req.query;

    const filter: Record<string, unknown> = { type: "engineer" };

    if (location) filter.location = new RegExp(String(location), "i");
    if (specialization)
      filter.specialization = new RegExp(String(specialization), "i");
    if (q) {
      filter.$or = [
        { name: new RegExp(String(q), "i") },
        { title: new RegExp(String(q), "i") },
        { specialties: new RegExp(String(q), "i") },
      ];
    }

    const engineers = await User.find(filter)
      .select("-passwordHash")
      .sort({ rating: -1, reviewsCount: -1 });

    if (!engineers.length) {
      return res.json({
        total: sampleEngineers.length,
        results: sampleEngineers,
      });
    }

    return res.json({
      total: engineers.length,
      results: engineers.map(toEngineerDTO),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      type: user.type,
      bio: user.bio,
      title: user.title,
      phone: user.phone,
      location: user.location,
      specialization: user.specialization,
      experience: user.experience,
      specialties: user.specialties || [],
      imageUrl: user.imageUrl,
      hourlyRate: user.hourlyRate,
      rating: user.rating ?? 0,
      reviewsCount: user.reviewsCount ?? 0,
      portfolio: user.portfolio || [],
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      type: user.type,
      bio: user.bio,
      title: user.title,
      phone: user.phone,
      location: user.location,
      specialization: user.specialization,
      experience: user.experience,
      specialties: user.specialties || [],
      imageUrl: user.imageUrl,
      hourlyRate: user.hourlyRate,
      rating: user.rating ?? 0,
      reviewsCount: user.reviewsCount ?? 0,
      portfolio: user.portfolio || [],
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

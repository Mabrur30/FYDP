import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db";
import Engineer from "../models/Engineer";
import Client from "../models/Client";
import Project from "../models/Project";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import Bid from "../models/Bid";
import Earning from "../models/Earning";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required to run the seed script");
  }

  await connectDB(MONGO_URI);

  console.log(
    "Clearing existing sample data (only collections used by seed)...",
  );
  await Promise.all([
    Engineer.deleteMany({}),
    Client.deleteMany({}),
    Project.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    Bid.deleteMany({}),
    Earning.deleteMany({}),
  ]);

  console.log("Creating sample users...");
  const passwordHash = await bcrypt.hash("password123", 8);

  const eng1 = await Engineer.create({
    name: "Rafiq Ahmed",
    email: "rafiq@example.com",
    phone: "+8801711111111",
    password: passwordHash,
    specialization: "Structural Engineering",
    title: "Senior Structural Engineer",
    bio: "Experienced in multi-storey residential and commercial structures.",
    specialties: ["Concrete", "Steel", "Seismic Design"],
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    hourlyRate: "30",
    location: "Dhaka",
    experience_years: 10,
    is_verified: true,
    rating: 4.8,
  });

  const eng2 = await Engineer.create({
    name: "Nadia Hossain",
    email: "nadia@example.com",
    phone: "+8801712222222",
    password: passwordHash,
    specialization: "Geotechnical Engineering",
    title: "Geotech Engineer",
    bio: "Soil investigation and foundation design specialist.",
    specialties: ["Soil Mechanics", "Foundation Design"],
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    hourlyRate: "35",
    location: "Chattogram",
    experience_years: 6,
    is_verified: false,
    rating: 4.5,
  });

  const client1 = await Client.create({
    name: "City Development Ltd",
    email: "client1@example.com",
    phone: "+8801910000000",
    password: passwordHash,
    location: "Dhaka",
  });

  const client2 = await Client.create({
    name: "Green Builders",
    email: "client2@example.com",
    phone: "+8801910000001",
    password: passwordHash,
    location: "Chattogram",
  });

  console.log("Creating sample project...");
  const project1 = await Project.create({
    title: "5-Story Residential Building",
    description:
      "Design and supervise construction of a 5-story residential building.",
    location: "Dhaka",
    budget: 1500000,
    status: "open",
    client_id: client1._id,
    engineer_id: eng1._id,
    type: "Residential",
    area: 1200,
    floors: "5",
  });

  console.log("Creating bid and earning...");
  const bid1 = await Bid.create({
    engineerId: eng1._id,
    projectId: project1._id,
    amount: 1400000,
    status: "won",
    proposal:
      "I will deliver detailed structural design and supervise the works.",
  });

  const earning1 = await Earning.create({
    engineerId: eng1._id,
    projectId: project1._id,
    amount: 500000,
    status: "paid",
    type: "Milestone Payment",
    paidAt: new Date(),
  });

  console.log("Creating conversation and messages...");
  const conv = await Conversation.create({
    engineerId: String(eng1._id),
    clientId: String(client1._id),
    participants: [String(eng1._id), String(client1._id)],
    name: client1.name,
    title: "Project owner",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
    online: false,
    lastMessage: "Hello, can we confirm the foundation schedule?",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
  });

  await Message.create({
    conversationId: String(conv._id),
    senderId: String(client1._id),
    text: "Hi, please confirm your availability for site visit next week.",
    timestamp: new Date().toISOString(),
    read: false,
  });

  await Message.create({
    conversationId: String(conv._id),
    senderId: String(eng1._id),
    text: "I can visit on Tuesday or Thursday. Which works for you?",
    timestamp: new Date().toISOString(),
    read: false,
  });

  console.log("Seed complete. Inserted:", {
    engineers: [eng1._id, eng2._id],
    clients: [client1._id, client2._id],
    project: project1._id,
    bid: bid1._id,
    earning: earning1._id,
    conversation: conv._id,
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

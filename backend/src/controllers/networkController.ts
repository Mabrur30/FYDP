import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import Engineer from "../models/Engineer";
import Client from "../models/Client";
import Project from "../models/Project";
import NetworkConnection from "../models/NetworkConnection";
import NetworkPost from "../models/NetworkPost";

type NetworkMember = {
  id: string;
  name: string;
  title: string;
  location: string;
  image: string;
  specialization: string;
  rating: number;
};

function getAuthUserId(req: AuthRequest) {
  return String(req.user?.id || "");
}

function fallbackImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
}

function formatRelativeDate(value?: Date | string) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return "This month";
}

async function resolveMember(memberId: string): Promise<NetworkMember> {
  const engineer = await Engineer.findById(memberId);
  if (engineer) {
    return {
      id: String(engineer._id),
      name: engineer.name,
      title:
        engineer.title ||
        (engineer.specialization
          ? `${engineer.specialization} Engineer`
          : "Civil Engineer"),
      location: engineer.location || "Bangladesh",
      image: engineer.imageUrl || fallbackImage(String(engineer._id)),
      specialization: engineer.specialization || "General Civil",
      rating: Number(engineer.rating || 0),
    };
  }

  const client = await Client.findById(memberId);
  if (client) {
    return {
      id: String(client._id),
      name: client.name,
      title: "Client",
      location: client.location || "Bangladesh",
      image: fallbackImage(String(client._id)),
      specialization: "Project Owner",
      rating: 0,
    };
  }

  return {
    id: memberId,
    name: "Member",
    title: "CivilHub Member",
    location: "Bangladesh",
    image: fallbackImage(memberId),
    specialization: "Construction",
    rating: 0,
  };
}

async function resolveMembers(memberIds: string[]) {
  const uniqueIds = Array.from(new Set(memberIds.filter(Boolean)));
  const members = await Promise.all(uniqueIds.map((id) => resolveMember(id)));

  const lookup = new Map<string, NetworkMember>();
  members.forEach((member) => {
    lookup.set(member.id, member);
  });

  return lookup;
}

function toPostDTO(post: any, author: NetworkMember, currentUserId: string) {
  const likedBy = Array.isArray(post.likedBy)
    ? post.likedBy.map((value: unknown) => String(value))
    : [];

  return {
    id: String(post._id),
    author: author.name,
    authorTitle: author.title,
    authorImage: author.image,
    timestamp: formatRelativeDate(post.createdAt),
    content: post.content,
    likes: Number(post.likes || 0),
    comments: Number(post.comments || 0),
    shares: Number(post.shares || 0),
    liked: likedBy.includes(currentUserId),
    type: "text" as const,
  };
}

export async function getConnections(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);

    const records = await NetworkConnection.find({
      status: "accepted",
      $or: [{ requesterId: currentUserId }, { recipientId: currentUserId }],
    }).sort({ updatedAt: -1 });

    const peerIds = records.map((record) =>
      String(
        record.requesterId === currentUserId
          ? record.recipientId
          : record.requesterId,
      ),
    );

    const memberLookup = await resolveMembers(peerIds);
    const peers = peerIds
      .map((id) => memberLookup.get(id))
      .filter((value): value is NetworkMember => Boolean(value));

    return res.json(peers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRequests(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);

    const [incomingRecords, outgoingRecords] = await Promise.all([
      NetworkConnection.find({
        status: "pending",
        recipientId: currentUserId,
      }).sort({ createdAt: -1 }),
      NetworkConnection.find({
        status: "pending",
        requesterId: currentUserId,
      }).sort({ createdAt: -1 }),
    ]);

    const incomingIds = incomingRecords.map((record) =>
      String(record.requesterId),
    );
    const outgoingIds = outgoingRecords.map((record) =>
      String(record.recipientId),
    );

    const memberLookup = await resolveMembers([...incomingIds, ...outgoingIds]);

    const incoming = incomingIds
      .map((id) => memberLookup.get(id))
      .filter((value): value is NetworkMember => Boolean(value));

    const outgoing = outgoingIds
      .map((id) => memberLookup.get(id))
      .filter((value): value is NetworkMember => Boolean(value));

    return res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createRequest(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);
    const recipientId = String(req.body?.recipientId || "").trim();

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required" });
    }

    if (recipientId === currentUserId) {
      return res
        .status(400)
        .json({ message: "You cannot connect to yourself" });
    }

    const existing = await NetworkConnection.findOne({
      $or: [
        { requesterId: currentUserId, recipientId },
        { requesterId: recipientId, recipientId: currentUserId },
      ],
    });

    if (existing?.status === "accepted") {
      return res.status(409).json({ message: "Already connected" });
    }

    if (existing?.status === "pending") {
      return res
        .status(409)
        .json({ message: "Connection request already pending" });
    }

    await NetworkConnection.create({
      requesterId: currentUserId,
      recipientId,
      status: "pending",
    });

    return res.status(201).json({ message: "Connection request sent" });
  } catch (err: any) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "Connection request already exists" });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptRequest(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);
    const requesterId = String(req.params.requesterId || "");

    const record = await NetworkConnection.findOneAndUpdate(
      {
        requesterId,
        recipientId: currentUserId,
        status: "pending",
      },
      { $set: { status: "accepted" } },
      { new: true },
    );

    if (!record) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    const member = await resolveMember(requesterId);
    return res.json({ connection: member });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function rejectRequest(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);
    const requesterId = String(req.params.requesterId || "");

    const deleted = await NetworkConnection.findOneAndDelete({
      requesterId,
      recipientId: currentUserId,
      status: "pending",
    });

    if (!deleted) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPosts(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);

    const [networkPosts, projects] = await Promise.all([
      NetworkPost.find().sort({ createdAt: -1 }).limit(30),
      Project.find().sort({ updatedAt: -1 }).limit(15),
    ]);

    const authorIds = networkPosts.map((post) => String(post.authorId));
    const projectOwnerIds = projects
      .map((project: any) => String(project.engineer_id || ""))
      .filter(Boolean);

    const memberLookup = await resolveMembers([
      ...authorIds,
      ...projectOwnerIds,
    ]);

    const userPosts = networkPosts.map((post) => {
      const author = memberLookup.get(String(post.authorId)) || {
        id: String(post.authorId),
        name: "Member",
        title: "CivilHub Member",
        location: "Bangladesh",
        image: fallbackImage(String(post.authorId)),
        specialization: "Construction",
        rating: 0,
      };
      return toPostDTO(post, author, currentUserId);
    });

    const projectPosts = projects.map((project: any, index: number) => {
      const ownerId = String(project.engineer_id || "");
      const author = memberLookup.get(ownerId) || {
        id: ownerId,
        name: "Project Owner",
        title: "Civil Professional",
        location: "Bangladesh",
        image: fallbackImage(ownerId || `project-${index}`),
        specialization: "Project",
        rating: 0,
      };

      return {
        id: `project-${String(project._id)}`,
        author: author.name,
        authorTitle: author.title,
        authorImage: author.image,
        timestamp: formatRelativeDate(project.updatedAt || project.createdAt),
        content:
          project.description && String(project.description).trim().length > 20
            ? String(project.description)
            : `${project.title} is currently ${String(project.status || "open").replace("_", " ")} in ${project.location || "Bangladesh"}.`,
        likes: 8 + index * 2,
        comments: 2 + index,
        shares: 1 + index,
        liked: false,
        type: "project" as const,
      };
    });

    const mergedPosts = [...userPosts, ...projectPosts].sort((a, b) => {
      const scoreA = a.timestamp === "Just now" ? 1 : 0;
      const scoreB = b.timestamp === "Just now" ? 1 : 0;
      return scoreB - scoreA;
    });

    return res.json(mergedPosts.slice(0, 40));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPost(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);
    const content = String(req.body?.content || "").trim();

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await NetworkPost.create({
      authorId: currentUserId,
      content,
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
    });

    const author = await resolveMember(currentUserId);
    return res.status(201).json(toPostDTO(post, author, currentUserId));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function likePost(req: AuthRequest, res: Response) {
  try {
    const currentUserId = getAuthUserId(req);
    const post = await NetworkPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likedBy = Array.isArray(post.likedBy)
      ? post.likedBy.map((value) => String(value))
      : [];
    const alreadyLiked = likedBy.includes(currentUserId);

    if (alreadyLiked) {
      post.likedBy = likedBy.filter((id) => id !== currentUserId);
      post.likes = Math.max(0, Number(post.likes || 0) - 1);
    } else {
      post.likedBy = [...likedBy, currentUserId];
      post.likes = Number(post.likes || 0) + 1;
    }

    await post.save();

    const author = await resolveMember(String(post.authorId));
    return res.json(toPostDTO(post, author, currentUserId));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

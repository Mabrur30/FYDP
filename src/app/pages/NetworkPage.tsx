import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthToken, getAuthUser } from "../utils/auth";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  Briefcase,
} from "lucide-react";

interface NetworkEngineer {
  id: string;
  name: string;
  title: string;
  location: string;
  image: string;
  specialization: string;
  rating: number;
}

interface NetworkProject {
  id: string;
  title: string;
  location: string;
  status: string;
  updatedAt?: string;
  description?: string;
}

interface ActivityItem {
  id: string;
  user: string;
  userImage: string;
  action: string;
  timestamp: string;
  content: string;
}

interface FeedPost {
  id: string;
  author: string;
  authorTitle: string;
  authorImage: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  type: "text" | "project" | "article" | "job";
}

interface NetworkRequestsResponse {
  incoming: NetworkEngineer[];
  outgoing: NetworkEngineer[];
}

function formatRelativeDate(value?: string) {
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

function normalizeStatus(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "completed a project";
  if (normalized === "in_progress") return "is working on a project";
  return "posted a new project";
}

function fallbackImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(String(message));
  }

  return data as T;
}

function toNetworkEngineer(raw: any): NetworkEngineer {
  return {
    id: String(raw?.id || raw?._id || ""),
    name: raw?.name || "Engineer",
    title:
      raw?.title ||
      (raw?.specialization
        ? `${raw.specialization} Engineer`
        : "Civil Engineer"),
    location: raw?.location || "Bangladesh",
    image:
      raw?.image ||
      raw?.imageUrl ||
      fallbackImage(String(raw?.id || raw?._id || "engineer")),
    specialization: raw?.specialization || "General Civil",
    rating: Number(raw?.rating || 0),
  };
}

export function NetworkPage() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const currentUser = getAuthUser();
  const currentUserId = String(currentUser?.id || currentUser?._id || "");
  const [activeTab, setActiveTab] = useState<
    "feed" | "connections" | "requests" | "suggestions"
  >("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState("");
  const [engineers, setEngineers] = useState<NetworkEngineer[]>([]);
  const [projects, setProjects] = useState<NetworkProject[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [connections, setConnections] = useState<NetworkEngineer[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<
    NetworkEngineer[]
  >([]);
  const [outgoingRequestIds, setOutgoingRequestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please sign in to access your network.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [
          engineersData,
          projectsData,
          connectionsData,
          requestsData,
          postsData,
        ] = await Promise.all([
          fetch("/api/engineers").then((res) => readJsonResponse<any[]>(res)),
          fetch("/api/projects").then((res) => readJsonResponse<any[]>(res)),
          fetch("/api/network/connections", { headers }).then((res) =>
            readJsonResponse<any[]>(res),
          ),
          fetch("/api/network/requests", { headers }).then((res) =>
            readJsonResponse<NetworkRequestsResponse>(res),
          ),
          fetch("/api/network/posts", { headers }).then((res) =>
            readJsonResponse<any[]>(res),
          ),
        ]);

        const mappedEngineers = (
          Array.isArray(engineersData) ? engineersData : []
        ).map((engineer: any): NetworkEngineer => toNetworkEngineer(engineer));

        const mappedProjects = (
          Array.isArray(projectsData) ? projectsData : []
        ).map(
          (project: any): NetworkProject => ({
            id: String(project.id || project._id || ""),
            title: project.title || "Project",
            location: project.location || "Bangladesh",
            status: String(project.status || "open"),
            updatedAt: project.updatedAt || project.createdAt,
            description: project.description || "",
          }),
        );

        const activityFeed: ActivityItem[] = mappedProjects
          .slice(0, 5)
          .map((project, index) => {
            const engineer =
              mappedEngineers[index % Math.max(1, mappedEngineers.length)];
            return {
              id: `activity-${project.id}`,
              user: engineer?.name || "Network Member",
              userImage: engineer?.image || fallbackImage(project.id),
              action: normalizeStatus(project.status),
              timestamp: formatRelativeDate(project.updatedAt),
              content: `${project.title} in ${project.location}`,
            };
          });

        const persistedConnections = (
          Array.isArray(connectionsData) ? connectionsData : []
        ).map((value: any) => toNetworkEngineer(value));

        const incomingRequests = (
          Array.isArray(requestsData?.incoming) ? requestsData.incoming : []
        ).map((value: any) => toNetworkEngineer(value));

        const outgoingRequests = (
          Array.isArray(requestsData?.outgoing) ? requestsData.outgoing : []
        ).map((value: any) => toNetworkEngineer(value));

        const feedPosts = (Array.isArray(postsData) ? postsData : []).map(
          (post: any): FeedPost => ({
            id: String(post.id || post._id || `post-${Math.random()}`),
            author: post.author || "Member",
            authorTitle: post.authorTitle || "CivilHub Member",
            authorImage:
              post.authorImage ||
              fallbackImage(String(post.id || post._id || "post")),
            timestamp: post.timestamp || "Recently",
            content: post.content || "",
            image: post.image,
            likes: Number(post.likes || 0),
            comments: Number(post.comments || 0),
            shares: Number(post.shares || 0),
            liked: Boolean(post.liked),
            type: (post.type || "text") as FeedPost["type"],
          }),
        );

        if (isMounted) {
          setEngineers(mappedEngineers);
          setProjects(mappedProjects);
          setActivities(activityFeed);
          setPosts(feedPosts);
          setConnections(persistedConnections);
          setConnectionRequests(incomingRequests);
          setOutgoingRequestIds(outgoingRequests.map((request) => request.id));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load network data",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const suggestions = useMemo(() => {
    const excluded = new Set([
      ...connections.map((item) => item.id),
      ...connectionRequests.map((item) => item.id),
      ...outgoingRequestIds,
      currentUserId,
    ]);
    return engineers.filter((engineer) => !excluded.has(engineer.id));
  }, [
    connections,
    connectionRequests,
    currentUserId,
    engineers,
    outgoingRequestIds,
  ]);

  async function handleAcceptRequest(id: string) {
    if (!token) return;

    try {
      const response = await fetch(`/api/network/requests/${id}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await readJsonResponse<{ connection: NetworkEngineer }>(
        response,
      );

      const mapped = toNetworkEngineer(data.connection);
      setConnections((prev) => [mapped, ...prev]);
      setConnectionRequests((prev) =>
        prev.filter((request) => request.id !== id),
      );
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to accept request",
      );
    }
  }

  async function handleRejectRequest(id: string) {
    if (!token) return;

    try {
      const response = await fetch(`/api/network/requests/${id}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        await readJsonResponse(response);
      }

      setConnectionRequests((prev) =>
        prev.filter((request) => request.id !== id),
      );
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reject request",
      );
    }
  }

  async function handleConnect(id: string) {
    if (!token) return;

    try {
      const response = await fetch("/api/network/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientId: id }),
      });

      await readJsonResponse(response);
      setOutgoingRequestIds((prev) =>
        prev.includes(id) ? prev : [id, ...prev],
      );
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send request",
      );
    }
  }

  function handleMessage(_connectionId?: string) {
    navigate("/messages");
  }

  async function handleLike(postId: string) {
    if (postId.startsWith("project-")) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      );
      return;
    }

    if (!token) return;

    try {
      const response = await fetch(`/api/network/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPost = await readJsonResponse<FeedPost>(response);

      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post)),
      );
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to like post",
      );
    }
  }

  async function handleCreatePost() {
    if (!postText.trim()) return;
    if (!token) return;

    try {
      const response = await fetch("/api/network/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: postText.trim() }),
      });

      const createdPost = await readJsonResponse<FeedPost>(response);
      setPosts((prev) => [createdPost, ...prev]);
      setPostText("");
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create post",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">My Network</h1>
            <p className="text-xl opacity-90">
              Connect with construction professionals across Bangladesh
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <input
              type="text"
              placeholder="Search connections by name, company, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Network Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-bold text-[#1E88E5]">
                      {loading ? "-" : connections.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Requests</span>
                    <span className="font-bold text-[#FF8F00]">
                      {loading ? "-" : connectionRequests.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-bold text-[#1E88E5]">
                      {loading ? "-" : projects.length * 12}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={activity.userImage}
                          alt={activity.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {activity.user}
                            </span>{" "}
                            <span className="text-gray-600">
                              {activity.action}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                          {activity.content && (
                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                              {activity.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="border-b">
                  <div className="flex overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab("feed")}
                      className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "feed"
                          ? "border-[#1E88E5] text-[#1E88E5]"
                          : "border-transparent text-gray-600 hover:text-[#1E88E5]"
                      }`}
                    >
                      Feed
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("connections")}
                      className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "connections"
                          ? "border-[#1E88E5] text-[#1E88E5]"
                          : "border-transparent text-gray-600 hover:text-[#1E88E5]"
                      }`}
                    >
                      Connections ({connections.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("requests")}
                      className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "requests"
                          ? "border-[#1E88E5] text-[#1E88E5]"
                          : "border-transparent text-gray-600 hover:text-[#1E88E5]"
                      }`}
                    >
                      Requests ({connectionRequests.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("suggestions")}
                      className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "suggestions"
                          ? "border-[#1E88E5] text-[#1E88E5]"
                          : "border-transparent text-gray-600 hover:text-[#1E88E5]"
                      }`}
                    >
                      Suggestions ({suggestions.length})
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {loading && activeTab === "feed" ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Loading network feed...
                    </div>
                  ) : null}

                  {/* Feed Tab */}
                  {activeTab === "feed" && (
                    <div className="space-y-6">
                      {/* Create Post Box */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"
                            alt="Your profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <textarea
                              value={postText}
                              onChange={(e) => setPostText(e.target.value)}
                              placeholder="Share your thoughts, projects, or opportunities..."
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] resize-none"
                            />
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Add image"
                                  aria-label="Add image"
                                >
                                  <ImageIcon
                                    size={20}
                                    className="text-gray-600"
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Add video"
                                  aria-label="Add video"
                                >
                                  <Video size={20} className="text-gray-600" />
                                </button>
                                <button
                                  type="button"
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Add document"
                                  aria-label="Add document"
                                >
                                  <FileText
                                    size={20}
                                    className="text-gray-600"
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Post a job"
                                  aria-label="Post a job"
                                >
                                  <Briefcase
                                    size={20}
                                    className="text-gray-600"
                                  />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={handleCreatePost}
                                disabled={!postText.trim()}
                                className="px-6 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Posts Feed */}
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                        >
                          {/* Post Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#1A1A1A]">
                                {post.author}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {post.authorTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {post.timestamp}
                              </p>
                            </div>
                            {post.type === "job" && (
                              <span className="px-3 py-1 bg-[#FF8F00] bg-opacity-10 text-[#FF8F00] text-xs font-semibold rounded-full">
                                Job Posting
                              </span>
                            )}
                            {post.type === "project" && (
                              <span className="px-3 py-1 bg-[#1E88E5] bg-opacity-10 text-[#1E88E5] text-xs font-semibold rounded-full">
                                Project
                              </span>
                            )}
                          </div>

                          {/* Post Content */}
                          <p className="text-[#1A1A1A] mb-4">{post.content}</p>

                          {/* Post Image */}
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full rounded-lg mb-4 object-cover max-h-96"
                            />
                          )}

                          {/* Engagement Stats */}
                          <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-3">
                            <span className="text-sm text-gray-600">
                              {post.likes} {post.likes === 1 ? "like" : "likes"}
                            </span>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>{post.comments} comments</span>
                              <span>{post.shares} shares</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-around">
                            <button
                              type="button"
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                post.liked
                                  ? "text-[#1E88E5] bg-blue-50"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <ThumbsUp
                                size={18}
                                className={post.liked ? "fill-current" : ""}
                              />
                              <span className="font-medium">Like</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MessageCircle size={18} />
                              <span className="font-medium">Comment</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Share2 size={18} />
                              <span className="font-medium">Share</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Send size={18} />
                              <span className="font-medium">Send</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Connection Requests Tab */}
                  {activeTab === "requests" && (
                    <div className="space-y-4">
                      {connectionRequests.length > 0 ? (
                        connectionRequests.map((request) => (
                          <div
                            key={request.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-[#1E88E5] transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={request.image}
                                alt={request.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">
                                  {request.name}
                                </h4>
                                <p className="text-gray-600">{request.title}</p>
                                <p className="text-sm text-gray-500">
                                  {request.location}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {request.specialization}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAcceptRequest(request.id)
                                  }
                                  className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRejectRequest(request.id)
                                  }
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Ignore
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500">
                            No pending connection requests
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Connections Tab */}
                  {activeTab === "connections" && (
                    <div className="grid grid-cols-1 gap-4">
                      {connections
                        .filter(
                          (conn) =>
                            conn.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            conn.title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            conn.specialization
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((connection) => (
                          <div
                            key={connection.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-[#1E88E5] transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={connection.image}
                                alt={connection.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">
                                  {connection.name}
                                </h4>
                                <p className="text-gray-600">
                                  {connection.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {connection.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {connection.location} •{" "}
                                  {connection.specialization}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMessage(connection.id)}
                                  className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                                >
                                  Message
                                </button>
                                <button
                                  type="button"
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Suggestions Tab */}
                  {activeTab === "suggestions" && (
                    <div className="grid grid-cols-1 gap-4">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#1E88E5] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={suggestion.image}
                              alt={suggestion.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">
                                {suggestion.name}
                              </h4>
                              <p className="text-gray-600">
                                {suggestion.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {suggestion.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {suggestion.location} •{" "}
                                {suggestion.specialization}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleConnect(suggestion.id)}
                                className="px-4 py-2 bg-[#FF8F00] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
                              >
                                Connect
                              </button>
                              <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

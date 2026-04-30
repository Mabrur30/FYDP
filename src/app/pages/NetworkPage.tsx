import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
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

interface Connection {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  image: string;
  mutualConnections: number;
  specialization: string;
}

interface ConnectionRequest {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  mutualConnections: number;
}

interface Activity {
  id: number;
  user: string;
  userImage: string;
  action: string;
  timestamp: string;
  content?: string;
}

interface Post {
  id: number;
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

export function NetworkPage() {
  const [activeTab, setActiveTab] = useState<
    "feed" | "connections" | "requests" | "suggestions"
  >("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Mahmud Hasan",
      authorTitle: "Senior Structural Engineer at StructurePro BD",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      timestamp: "2 hours ago",
      content:
        "Excited to announce the successful completion of Bashundhara R-A Tower, a 15-story residential complex! This project featured advanced seismic design and sustainable construction practices. Proud of the team effort! 🏗️",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
      likes: 127,
      comments: 24,
      shares: 15,
      liked: false,
      type: "project",
    },
    {
      id: 2,
      author: "Sabrina Akter",
      authorTitle: "Environmental Engineer at Green Construction Ltd",
      authorImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      timestamp: "5 hours ago",
      content:
        "New LEED certification guidelines for sustainable construction in Bangladesh just released! Key changes include stricter water efficiency standards and enhanced indoor air quality requirements. Every construction professional should review these updates.",
      likes: 89,
      comments: 18,
      shares: 42,
      liked: true,
      type: "article",
    },
    {
      id: 3,
      author: "Ashraf Ali",
      authorTitle: "Construction Manager at Mega Projects BD",
      authorImage:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop",
      timestamp: "1 day ago",
      content:
        "We're hiring! Looking for 3 experienced Site Engineers for our upcoming commercial project in Gulshan. Requirements: 5+ years experience, BUET graduate preferred. Send your CV to careers@megaprojectsbd.com",
      likes: 56,
      comments: 12,
      shares: 28,
      liked: false,
      type: "job",
    },
    {
      id: 4,
      author: "Razia Sultana",
      authorTitle: "Bridge Design Engineer at Infrastructure Innovators",
      authorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      timestamp: "2 days ago",
      content:
        "Attended an excellent workshop on modern bridge construction techniques. The future of infrastructure in Bangladesh looks promising with these innovative approaches to design and sustainability.",
      image:
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=500&fit=crop",
      likes: 203,
      comments: 35,
      shares: 19,
      liked: true,
      type: "text",
    },
    {
      id: 5,
      author: "Tanvir Ahmed",
      authorTitle: "Geotechnical Engineer at Foundation Experts BD",
      authorImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      timestamp: "3 days ago",
      content:
        "Completed soil testing for a major infrastructure project in Chittagong. The geological survey revealed fascinating insights about the region's soil composition. Data-driven foundation design is the future!",
      likes: 94,
      comments: 15,
      shares: 8,
      liked: false,
      type: "project",
    },
  ]);

  const connectionRequests: ConnectionRequest[] = [
    {
      id: 1,
      name: "Kamal Hassan",
      title: "Structural Engineer",
      company: "BuildTech Solutions",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      mutualConnections: 12,
    },
    {
      id: 2,
      name: "Farida Rahman",
      title: "Civil Project Manager",
      company: "Metro Infrastructure Ltd",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      mutualConnections: 8,
    },
  ];

  const suggestions: Connection[] = [
    {
      id: 1,
      name: "Tanvir Ahmed",
      title: "Geotechnical Engineer",
      company: "Foundation Experts BD",
      location: "Dhaka, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      mutualConnections: 15,
      specialization: "Soil Mechanics",
    },
    {
      id: 2,
      name: "Nadia Islam",
      title: "Highway Design Engineer",
      company: "Roads & Highways Department",
      location: "Chittagong, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      mutualConnections: 9,
      specialization: "Transportation Engineering",
    },
    {
      id: 3,
      name: "Rahim Khan",
      title: "Water Resources Engineer",
      company: "Delta Engineering",
      location: "Sylhet, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      mutualConnections: 6,
      specialization: "Hydraulics",
    },
  ];

  const connections: Connection[] = [
    {
      id: 1,
      name: "Mahmud Hasan",
      title: "Senior Structural Engineer",
      company: "StructurePro BD",
      location: "Dhaka, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      mutualConnections: 23,
      specialization: "High-Rise Buildings",
    },
    {
      id: 2,
      name: "Sabrina Akter",
      title: "Environmental Engineer",
      company: "Green Construction Ltd",
      location: "Dhaka, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      mutualConnections: 18,
      specialization: "Sustainable Design",
    },
    {
      id: 3,
      name: "Ashraf Ali",
      title: "Construction Manager",
      company: "Mega Projects BD",
      location: "Dhaka, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop",
      mutualConnections: 31,
      specialization: "Commercial Projects",
    },
    {
      id: 4,
      name: "Razia Sultana",
      title: "Bridge Design Engineer",
      company: "Infrastructure Innovators",
      location: "Chittagong, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      mutualConnections: 14,
      specialization: "Bridge Engineering",
    },
  ];

  const activities: Activity[] = [
    {
      id: 1,
      user: "Mahmud Hasan",
      userImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      action: "completed a project",
      timestamp: "2 hours ago",
      content:
        "Successfully completed the structural design for Bashundhara R-A Tower 15-story residential complex.",
    },
    {
      id: 2,
      user: "Sabrina Akter",
      userImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
      action: "shared an article",
      timestamp: "5 hours ago",
      content:
        "New LEED certification guidelines for sustainable construction in Bangladesh.",
    },
    {
      id: 3,
      user: "Ashraf Ali",
      userImage:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop",
      action: "posted a job opening",
      timestamp: "1 day ago",
      content:
        "Looking for experienced Site Engineers for ongoing commercial project in Gulshan.",
    },
  ];

  const handleAcceptRequest = (id: number) => {
    console.log("Accepted connection request:", id);
  };

  const handleRejectRequest = (id: number) => {
    console.log("Rejected connection request:", id);
  };

  const handleConnect = (id: number) => {
    console.log("Sent connection request to:", id);
  };

  const handleMessage = (id: number) => {
    console.log("Message connection:", id);
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    const newPost: Post = {
      id: posts.length + 1,
      author: "You",
      authorTitle: "Civil Engineer",
      authorImage:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
      timestamp: "Just now",
      content: postText,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      type: "text",
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Network Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-bold text-[#1E88E5]">
                      {connections.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Requests</span>
                    <span className="font-bold text-[#FF8F00]">
                      {connectionRequests.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-bold text-[#1E88E5]">142</span>
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
                                  {request.company}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {request.mutualConnections} mutual connections
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
                            conn.company
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
                                  {connection.company}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {connection.location} •{" "}
                                  {connection.specialization}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {connection.mutualConnections} mutual
                                  connections
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleMessage(connection.id)}
                                  className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                                >
                                  Message
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
                                {suggestion.company}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {suggestion.location} •{" "}
                                {suggestion.specialization}
                              </p>
                              <p className="text-xs text-gray-500">
                                {suggestion.mutualConnections} mutual
                                connections
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConnect(suggestion.id)}
                                className="px-4 py-2 bg-[#FF8F00] text-white rounded-lg hover:bg-[#F57C00] transition-colors"
                              >
                                Connect
                              </button>
                              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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

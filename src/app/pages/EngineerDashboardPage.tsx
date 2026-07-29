import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Gavel,
  MessageSquare,
  DollarSign,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Search,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Download,
  Upload,
  Edit,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Star,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthToken } from "../utils/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

type EngineerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  imageUrl?: string;
  hourlyRate?: string;
  location: string;
  experience_years: number;
  is_verified: boolean;
  rating: number;
  createdAt?: string;
};

type EngineerProfileResponse = {
  engineer: EngineerProfile;
  summary: string;
  stats: {
    totalProjects: number;
    completedProjects: number;
    reviewCount: number;
    averageRating: number;
    successRate: number;
    memberSince: string;
  };
};

type EngineerProfileForm = {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  title: string;
  bio: string;
  specialties: string;
  imageUrl: string;
  hourlyRate: string;
  location: string;
  experience_years: string;
};

type DashboardMessage = {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  read: boolean;
};

type DashboardConversation = {
  id: number;
  userId: number;
  name: string;
  title: string;
  image: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
  messages: DashboardMessage[];
};

type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function createEmptyProfileForm(): EngineerProfileForm {
  return {
    name: "",
    email: "",
    phone: "",
    specialization: "",
    title: "",
    bio: "",
    specialties: "",
    imageUrl: "",
    hourlyRate: "",
    location: "",
    experience_years: "",
  };
}

function createProfileForm(profile: EngineerProfileResponse | null) {
  if (!profile) return createEmptyProfileForm();

  return {
    name: profile.engineer.name || "",
    email: profile.engineer.email || "",
    phone: profile.engineer.phone || "",
    specialization: profile.engineer.specialization || "",
    title: profile.engineer.title || "",
    bio: profile.engineer.bio || "",
    specialties: profile.engineer.specialties?.join(", ") || "",
    imageUrl: profile.engineer.imageUrl || "",
    hourlyRate: profile.engineer.hourlyRate || "",
    location: profile.engineer.location || "",
    experience_years: String(profile.engineer.experience_years ?? ""),
  };
}

function getStoredEngineerId() {
  if (typeof window === "undefined") return null;

  const rawAuthUser = window.localStorage.getItem("authUser");
  if (!rawAuthUser) return null;

  try {
    const authUser = JSON.parse(rawAuthUser) as { _id?: string; id?: string };
    return authUser._id || authUser.id || null;
  } catch {
    return null;
  }
}

function safeDateLabel(value: string | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getProgressWidthClass(progress: number) {
  switch (progress) {
    case 100:
      return "w-full";
    case 90:
      return "w-[90%]";
    case 65:
      return "w-[65%]";
    case 40:
      return "w-[40%]";
    default:
      return "w-0";
  }
}

function normalizeStatus(value: string | undefined) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function parseBangladeshAmount(value: string | number | undefined) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBangladeshAmount(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

function toSpecialtiesList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type EngineerDashboardSection =
  | "overview"
  | "projects"
  | "bids"
  | "messages"
  | "earnings"
  | "profile";

function getDashboardSection(search: string): EngineerDashboardSection {
  const section = new URLSearchParams(search).get("section");

  if (
    section === "overview" ||
    section === "projects" ||
    section === "bids" ||
    section === "messages" ||
    section === "earnings" ||
    section === "profile"
  ) {
    return section;
  }

  return "overview";
}

export function EngineerDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = getDashboardSection(location.search);
  const selectedConversationId = new URLSearchParams(location.search).get(
    "conversation",
  );
  const [profile, setProfile] = useState<EngineerProfileResponse | null>(null);
  const [profileError, setProfileError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [profileForm, setProfileForm] = useState<EngineerProfileForm>(
    createEmptyProfileForm(),
  );

  const engineerId = getStoredEngineerId();
  function goToSection(
    section: EngineerDashboardSection,
    conversationId?: number | string,
  ) {
    const params = new URLSearchParams();
    params.set("section", section);
    if (conversationId !== undefined && conversationId !== null) {
      params.set("conversation", String(conversationId));
    }
    navigate(`${location.pathname}?${params.toString()}`);
  }

  const token = getAuthToken();

  const [projects, setProjects] = useState<
    {
      id: number | string;
      name: string;
      client: string;
      status: string;
      budget: string;
      progress: number;
      deadline: string;
    }[]
  >([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [bids, setBids] = useState<
    {
      id: number | string;
      projectId: string;
      project: string;
      client: string;
      amount: number;
      budget: string;
      deadline: string;
      status: string;
      submitted: string;
      proposal: string;
    }[]
  >([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  const [availableProjects, setAvailableProjects] = useState<
    {
      id: string;
      title: string;
      location: string;
      budget: number;
    }[]
  >([]);
  const [availableProjectsLoading, setAvailableProjectsLoading] =
    useState(false);

  const [conversations, setConversations] = useState<DashboardConversation[]>(
    [],
  );
  const [conversationsLoading, setConversationsLoading] = useState(false);

  const [earnings, setEarnings] = useState<
    {
      id: number | string;
      project: string;
      amount: string;
      status: string;
      date: string;
      type: string;
    }[]
  >([]);
  const [earningsLoading, setEarningsLoading] = useState(false);

  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    [],
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  async function refreshProfile() {
    if (!engineerId) {
      throw new Error("No engineer profile id was found.");
    }

    const response = await fetch(`/api/engineers/${engineerId}/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || "Unable to load profile");
    }

    setProfile(data as EngineerProfileResponse);
    return data as EngineerProfileResponse;
  }

  async function loadProjects() {
    if (!engineerId) return;
    setProjectsLoading(true);
    try {
      const res = await fetch(`/api/engineers/${engineerId}/projects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Unable to load projects");
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProjectsLoading(false);
    }
  }

  async function loadBids() {
    if (!engineerId) return;
    setBidsLoading(true);
    try {
      const res = await fetch(`/api/bids/engineer/${engineerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Unable to load bids");
      const data = await res.json();
      setBids(
        (data || []).map((bid: any) => ({
          id: String(bid.id || bid._id || ""),
          projectId: String(bid.projectId || ""),
          project: bid.projectTitle || bid.project || "Project",
          client: bid.clientName || bid.client || "Client",
          amount: Number(bid.amount || 0),
          budget: formatBangladeshAmount(Number(bid.amount || 0)),
          deadline: bid.deadline
            ? String(bid.deadline).slice(0, 10)
            : "Not available",
          status: String(bid.status || "pending")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char: string) => char.toUpperCase()),
          submitted: bid.submittedAt
            ? String(bid.submittedAt).slice(0, 10)
            : "Not available",
          proposal: bid.proposal || "",
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setBidsLoading(false);
    }
  }

  async function loadAvailableProjects() {
    setAvailableProjectsLoading(true);
    try {
      const res = await fetch(`/api/projects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Unable to load available projects");
      const data = await res.json();
      setAvailableProjects(
        (data || [])
          .filter((project: any) => String(project.status || "") === "open")
          .map((project: any) => ({
            id: String(project.id || project._id || ""),
            title: project.title || "Project",
            location: project.location || "Bangladesh",
            budget: Number(project.budget || 0),
          })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAvailableProjectsLoading(false);
    }
  }

  async function loadConversations() {
    if (!engineerId) return;
    setConversationsLoading(true);
    try {
      const res = await fetch(`/api/conversations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Unable to load conversations");
      const data = await res.json();
      // adapt shape if needed
      setConversations(
        (data || []).map((c: any) => ({
          id: Number(c.id) || c.id,
          userId: Number(c.userId) || c.userId,
          name: c.name || "",
          title: c.title || "",
          image: c.image || "",
          avatar: c.image || "",
          lastMessage: c.lastMessage || "",
          lastMessageTime: c.lastMessageTime || "",
          unread: c.unreadCount || 0,
          online: c.online || false,
          messages: [],
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setConversationsLoading(false);
    }
  }

  async function loadEarnings() {
    if (!engineerId) return;
    setEarningsLoading(true);
    try {
      const res = await fetch(`/api/engineers/${engineerId}/earnings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Unable to load earnings");
      const data = await res.json();
      setEarnings((data && data.items) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setEarningsLoading(false);
    }
  }

  async function loadNotifications() {
    if (!token) return;
    try {
      const res = await fetch(`/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to load notifications");
      const data = await res.json();
      setUnreadNotifications(Number(data?.unreadCount || 0));
      setNotifications(
        (data?.items || []).map((item: any) => ({
          id: String(item.id || item._id || ""),
          title: item.title || "Notification",
          message: item.message || "",
          read: Boolean(item.read),
          createdAt: item.createdAt || "",
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function submitBidForProject(projectId: string, projectTitle: string) {
    const amountInput = window.prompt(
      `Enter bid amount for ${projectTitle} (BDT)`,
      "",
    );
    if (!amountInput) return;

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Please provide a valid positive amount.");
      return;
    }

    const proposal =
      window.prompt("Enter a short proposal (optional)", "") || "";
    const deadline =
      window.prompt("Estimated completion date (YYYY-MM-DD, optional)", "") ||
      "";

    try {
      const res = await fetch(`/api/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId,
          amount,
          proposal,
          deadline: deadline || undefined,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to submit bid");
      }

      await Promise.all([
        loadBids(),
        loadAvailableProjects(),
        loadNotifications(),
      ]);
      window.alert("Bid submitted successfully.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to submit bid");
    }
  }

  async function editBid(
    bidId: string | number,
    currentAmount: number,
    currentProposal: string,
  ) {
    const amountInput = window.prompt(
      "Update bid amount",
      String(currentAmount),
    );
    if (!amountInput) return;

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Please provide a valid positive amount.");
      return;
    }

    const proposal =
      window.prompt("Update proposal", currentProposal || "") || "";

    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount, proposal }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to update bid");
      }

      await loadBids();
      window.alert("Bid updated.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to update bid");
    }
  }

  async function withdrawBid(bidId: string | number) {
    const confirmed = window.confirm("Withdraw this bid?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/bids/${bidId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to withdraw bid");
      }

      await Promise.all([
        loadBids(),
        loadAvailableProjects(),
        loadNotifications(),
      ]);
      window.alert("Bid withdrawn.");
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to withdraw bid",
      );
    }
  }

  async function updateProjectStatus(
    projectId: string | number,
    status: "in_progress" | "completed",
  ) {
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to update project status");
      }

      await Promise.all([loadProjects(), loadEarnings(), loadNotifications()]);
      window.alert("Project status updated.");
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to update project status",
      );
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!engineerId) {
        if (isMounted) {
          setProfileError("No engineer profile id was found.");
          setLoadingProfile(false);
        }
        return;
      }

      setProfileError("");

      try {
        await refreshProfile();
      } catch (error) {
        if (isMounted) {
          setProfileError(
            error instanceof Error ? error.message : "Unable to load profile",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    setLoadingProfile(true);
    loadProfile();
    loadProjects();
    loadBids();
    loadAvailableProjects();
    loadConversations();
    loadEarnings();
    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [engineerId]);

  useEffect(() => {
    if (profile) {
      setProfileForm(createProfileForm(profile));
    }
  }, [profile]);
  async function handleEditProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!engineerId) {
      setSaveError("No engineer id found");
      return;
    }

    setIsSavingProfile(true);
    setSaveError("");
    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        specialization: profileForm.specialization,
        title: profileForm.title,
        bio: profileForm.bio,
        specialties: toSpecialtiesList(profileForm.specialties),
        imageUrl: profileForm.imageUrl,
        hourlyRate: profileForm.hourlyRate,
        location: profileForm.location,
        experience_years: profileForm.experience_years,
      };

      const res = await fetch(`/api/engineers/${engineerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(data?.message || "Unable to save profile");

      await refreshProfile();
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      setSaveError(
        err instanceof Error ? err.message : "Unable to save profile",
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  const selectedConversation =
    conversations.find(
      (conversation) =>
        String(conversation.id) === selectedConversationId ||
        String(conversation.userId) === selectedConversationId,
    ) || conversations[0];

  const totalProjectsCount = projects.length;
  const completedProjectsCount = projects.filter(
    (project) => normalizeStatus(project.status) === "completed",
  ).length;
  const activeProjectsCount = projects.filter(
    (project) => normalizeStatus(project.status) !== "completed",
  ).length;
  const pendingBidsCount = bids.filter((bid) => {
    const status = normalizeStatus(bid.status);
    return (
      status === "pending" ||
      status === "under_review" ||
      status === "shortlisted"
    );
  }).length;
  const totalEarningsAmount = earnings.reduce(
    (sum, earning) => sum + parseBangladeshAmount(earning.amount),
    0,
  );
  const completionRate =
    profile?.stats.successRate ??
    (totalProjectsCount
      ? Math.round((completedProjectsCount / totalProjectsCount) * 100)
      : 0);

  // earnings loaded from backend into `earnings` state

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {loadingProfile ? (
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E88E5]" />
            <p className="text-lg font-semibold text-slate-800">
              Loading profile...
            </p>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <>
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#1E88E5]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Active Projects</h3>
                      <FileText size={24} className="text-[#1E88E5]" />
                    </div>
                    <p className="text-4xl font-bold text-[#1A1A1A]">
                      {projectsLoading ? "-" : activeProjectsCount}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {completedProjectsCount} completed of {totalProjectsCount}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF8F00]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Pending Bids</h3>
                      <Gavel size={24} className="text-[#FF8F00]" />
                    </div>
                    <p className="text-4xl font-bold text-[#1A1A1A]">
                      {bidsLoading ? "-" : pendingBidsCount}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {bids.length} total bids tracked
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Total Earnings</h3>
                      <DollarSign size={24} className="text-green-500" />
                    </div>
                    <p className="text-4xl font-bold text-[#1A1A1A]">
                      {earningsLoading
                        ? "BDT -"
                        : `BDT ${formatBangladeshAmount(totalEarningsAmount)}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Total</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600">Completion Rate</h3>
                      <TrendingUp size={24} className="text-purple-500" />
                    </div>
                    <p className="text-4xl font-bold text-[#1A1A1A]">
                      {projectsLoading ? "-%" : `${completionRate}%`}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Based on project statuses
                    </p>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Recent Projects
                    </h3>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-[#1A1A1A]">
                              {project.name}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                project.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : project.status === "Review"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {project.client}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-[#1E88E5] h-2 rounded-full ${getProgressWidthClass(project.progress)}`}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => goToSection("projects")}
                      className="mt-4 w-full text-[#1E88E5] font-semibold hover:underline"
                    >
                      View All Projects →
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Recent Messages
                    </h3>
                    <div className="space-y-4">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="flex gap-3 border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2 py-3"
                          onClick={() => goToSection("messages", conv.id)}
                        >
                          <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-[#1A1A1A]">
                                {conv.name}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {conv.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {conv.lastMessage}
                            </p>
                            {conv.unread > 0 && (
                              <span className="inline-block mt-1 bg-[#1E88E5] text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unread} new
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => goToSection("messages")}
                      className="mt-4 w-full text-[#1E88E5] font-semibold hover:underline"
                    >
                      View All Messages →
                    </button>

                    <div className="mt-6 border-t pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-semibold text-[#1A1A1A]">
                          Notifications
                        </h4>
                        <span className="rounded-full bg-[#1E88E5]/10 px-2 py-0.5 text-xs font-semibold text-[#1E88E5]">
                          {unreadNotifications} unread
                        </span>
                      </div>
                      <div className="space-y-2">
                        {notifications.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-gray-50 p-2"
                          >
                            <p className="text-sm font-medium text-[#1A1A1A]">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">
                    My Projects
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Project Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Budget
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Deadline
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {projects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {project.client}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                project.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : project.status === "Review"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {project.status === "In Progress" && (
                                <Clock size={14} className="mr-1" />
                              )}
                              {project.status === "Review" && (
                                <AlertCircle size={14} className="mr-1" />
                              )}
                              {project.status === "Completed" && (
                                <CheckCircle size={14} className="mr-1" />
                              )}
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                            BDT {project.budget}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                                <div
                                  className={`bg-[#1E88E5] h-2 rounded-full ${getProgressWidthClass(project.progress)}`}
                                />
                              </div>
                              <span className="text-sm font-semibold">
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {project.deadline}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#1E88E5] border-[#1E88E5]"
                              >
                                View Details
                              </Button>
                              {project.status === "Review" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateProjectStatus(
                                      project.id,
                                      "in_progress",
                                    )
                                  }
                                >
                                  Start
                                </Button>
                              )}
                              {project.status === "In Progress" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    updateProjectStatus(project.id, "completed")
                                  }
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bids Section */}
            {activeSection === "bids" && (
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                      My Bids
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-[#1E88E5] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                              {bid.project}
                            </h3>
                            <p className="text-gray-600">
                              Client: {bid.client}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              bid.status === "Pending"
                                ? "bg-gray-100 text-gray-700"
                                : bid.status === "Under Review"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Budget Range
                            </p>
                            <p className="font-semibold text-[#1A1A1A]">
                              BDT {bid.budget}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Submitted On
                            </p>
                            <p className="font-semibold text-[#1A1A1A]">
                              {bid.submitted}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Deadline</p>
                            <p className="font-semibold text-[#1A1A1A]">
                              {bid.deadline}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="border-[#1E88E5] text-[#1E88E5]"
                          >
                            View Bid
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                            onClick={() =>
                              editBid(bid.id, bid.amount, bid.proposal)
                            }
                          >
                            Edit Bid
                          </Button>
                          {bid.status !== "Won" && bid.status !== "Lost" && (
                            <Button
                              variant="outline"
                              className="border-rose-300 text-rose-700"
                              onClick={() => withdrawBid(bid.id)}
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                    Available Projects
                  </h3>
                  {availableProjectsLoading ? (
                    <p className="text-sm text-gray-600">Loading projects...</p>
                  ) : availableProjects.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No open projects are available right now.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {availableProjects.slice(0, 5).map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                        >
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">
                              {project.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {project.location} • BDT{" "}
                              {formatBangladeshAmount(project.budget)}
                            </p>
                          </div>
                          <Button
                            className="bg-[#FF8F00] hover:bg-[#F57C00] text-white"
                            onClick={() =>
                              submitBidForProject(project.id, project.title)
                            }
                          >
                            Submit Bid
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Section */}
            {activeSection === "messages" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-200px)]">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">
                    Messages
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                  <div className="lg:col-span-1 border-r overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => goToSection("messages", conv.id)}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-[#1A1A1A] truncate">
                                {conv.name}
                              </h4>
                              {conv.unread > 0 && (
                                <span className="bg-[#1E88E5] text-white text-xs px-2 py-0.5 rounded-full">
                                  {conv.unread}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {conv.lastMessageTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-2 flex flex-col bg-gray-50">
                    {conversationsLoading ? (
                      <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center">
                          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E88E5]" />
                          <p className="text-sm text-gray-600">
                            Loading conversations...
                          </p>
                        </div>
                      </div>
                    ) : !selectedConversation ? (
                      <div className="flex-1 flex items-center justify-center p-6">
                        <p className="text-gray-500">
                          No conversation selected.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                selectedConversation.image ||
                                selectedConversation.avatar
                              }
                              alt={selectedConversation.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-[#1A1A1A]">
                                {selectedConversation.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {selectedConversation.title}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {selectedConversation.online
                              ? "Active now"
                              : "Offline"}
                          </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                          {selectedConversation.messages.map((message) => {
                            const isOwn =
                              String(message.senderId) === String(engineerId);
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                    isOwn
                                      ? "rounded-tr-sm bg-[#1E88E5] text-white"
                                      : "rounded-tl-sm border border-gray-200 bg-white text-[#1A1A1A]"
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <p
                                    className={`mt-1 text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
                                  >
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Section */}
            {activeSection === "earnings" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <h3 className="text-gray-600 mb-2">Total Earnings</h3>
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      BDT 65,50,000
                    </p>
                    <p className="text-sm text-gray-600 mt-2">All time</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                    <h3 className="text-gray-600 mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      BDT 15,00,000
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      ↑ 20% from last month
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                    <h3 className="text-gray-600 mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-[#1A1A1A]">
                      BDT 20,50,000
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      2 payments processing
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                      Payment History
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Project
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {earnings.map((earning) => (
                          <tr
                            key={earning.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                              {earning.project}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {earning.type}
                            </td>
                            <td className="px-6 py-4 font-semibold text-green-600">
                              BDT {earning.amount}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {earning.date}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                  earning.status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : earning.status === "Processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {earning.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[#1E88E5] border-[#1E88E5]"
                              >
                                <Download size={16} className="mr-1" />
                                Invoice
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {profile ? (
                    <>
                      <div className="flex items-start gap-6 mb-8">
                        {profile.engineer.imageUrl ? (
                          <img
                            src={profile.engineer.imageUrl}
                            alt={profile.engineer.name}
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#0F4C81] flex items-center justify-center text-white text-3xl font-bold">
                            {profile.engineer.name
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0]?.toUpperCase())
                              .join("")}
                          </div>
                        )}
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                            {profile.engineer.name}
                          </h2>
                          <p className="text-xl text-gray-600 mb-4">
                            {profile.engineer.title ||
                              profile.engineer.specialization}
                          </p>
                          <div className="flex gap-4 mb-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Star
                                className="text-[#FF8F00] fill-current"
                                size={20}
                              />
                              <span className="font-semibold">
                                {profile.stats.averageRating.toFixed(1)} Rating
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="text-[#1E88E5]" size={20} />
                              <span className="font-semibold">
                                {profile.stats.completedProjects} Projects
                                Completed
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                            onClick={() => setIsEditOpen(true)}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                      </div>

                      {profileError ? null : null}
                    </>
                  ) : profileError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-8">
                      {profileError}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail size={20} className="text-[#1E88E5]" />
                          <span>
                            {profile?.engineer.email || "Not available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Phone size={20} className="text-[#1E88E5]" />
                          <span>
                            {profile?.engineer.phone || "Not available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <MapPin size={20} className="text-[#1E88E5]" />
                          <span>
                            {profile?.engineer.location || "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Professional Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Briefcase size={20} className="text-[#1E88E5]" />
                          <span>
                            {profile?.engineer.experience_years || 0}+ years
                            experience
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Award size={20} className="text-[#1E88E5]" />
                          <span>
                            {profile?.engineer.specialization ||
                              "Not available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar size={20} className="text-[#1E88E5]" />
                          <span>
                            Member since{" "}
                            {profile
                              ? safeDateLabel(profile.stats.memberSince)
                              : "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {profile?.summary || "No profile summary is available."}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.engineer.specialties?.length
                        ? profile.engineer.specialties
                        : [profile?.engineer.specialization || "Not available"]
                      ).map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-[#1E88E5] bg-opacity-10 text-[#1E88E5] rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your public engineer profile information and save it to the
              database.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleEditProfileSubmit}>
            {saveError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-title">Title</Label>
                <Input
                  id="profile-title"
                  value={profileForm.title}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="profile-specialization">Specialization</Label>
                <Input
                  id="profile-specialization"
                  value={profileForm.specialization}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      specialization: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="profile-specialties">
                  Specialties, comma separated
                </Label>
                <Input
                  id="profile-specialties"
                  value={profileForm.specialties}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      specialties: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="profile-bio">Bio</Label>
                <p className="text-xs text-slate-500">
                  Add a short summary of your experience, specialties, or
                  project focus.
                </p>
                <textarea
                  id="profile-bio"
                  placeholder="Write a concise professional bio"
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  className="min-h-28 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-image">Profile Image URL</Label>
                <Input
                  id="profile-image"
                  value={profileForm.imageUrl}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-rate">Hourly Rate</Label>
                <Input
                  id="profile-rate"
                  value={profileForm.hourlyRate}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      hourlyRate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-location">Location</Label>
                <Input
                  id="profile-location"
                  value={profileForm.location}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-experience">Experience Years</Label>
                <Input
                  id="profile-experience"
                  type="number"
                  min="0"
                  value={profileForm.experience_years}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      experience_years: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

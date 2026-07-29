import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Briefcase,
  Calculator,
  MessageSquare,
  FileText,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthToken, getAuthUser } from "../utils/auth";

type DashboardProject = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "completed";
  budget: number;
  updatedAt?: string;
  engineerId?: string | null;
};

type DashboardConversation = {
  id: string;
  unreadCount: number;
};

type SuggestedEngineer = {
  id: string;
  name: string;
  title?: string;
  specialization?: string;
};

type ProjectBid = {
  id: string;
  engineerId: string;
  engineerName: string;
  engineerTitle: string;
  amount: number;
  status: string;
  proposal: string;
  deadline?: string;
  submittedAt?: string;
};

type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

function formatUpdatedLabel(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return "This month";
}

function mapProjectStatus(
  status: DashboardProject["status"],
  hasEngineer: boolean,
) {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In Progress";
  if (hasEngineer) return "Quotation Received";
  return "Awaiting Engineer Match";
}

export function ClientDashboardPage() {
  const token = getAuthToken();
  const authUser = getAuthUser();
  const userId = authUser?._id || authUser?.id || "";

  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [conversations, setConversations] = useState<DashboardConversation[]>(
    [],
  );
  const [engineers, setEngineers] = useState<SuggestedEngineer[]>([]);
  const [projectBids, setProjectBids] = useState<Record<string, ProjectBid[]>>(
    {},
  );
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    [],
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (!userId) {
        if (isMounted) {
          setLoading(false);
          setError("No client account found. Please sign in again.");
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [projectsRes, conversationsRes, engineersRes] = await Promise.all(
          [
            fetch("/api/projects", {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }),
            fetch("/api/conversations", {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }),
            fetch("/api/engineers"),
          ],
        );

        const [projectsText, conversationsText, engineersText] =
          await Promise.all([
            projectsRes.text(),
            conversationsRes.text(),
            engineersRes.text(),
          ]);

        const projectsData = projectsText ? JSON.parse(projectsText) : [];
        const conversationsData = conversationsText
          ? JSON.parse(conversationsText)
          : [];
        const engineersData = engineersText ? JSON.parse(engineersText) : [];

        if (!projectsRes.ok) {
          throw new Error(projectsData?.message || "Unable to load projects");
        }
        if (!conversationsRes.ok) {
          throw new Error(
            conversationsData?.message || "Unable to load conversations",
          );
        }
        if (!engineersRes.ok) {
          throw new Error(engineersData?.message || "Unable to load engineers");
        }

        const clientProjects = (Array.isArray(projectsData) ? projectsData : [])
          .filter((project: any) => {
            const projectClientId = String(project.client_id || "");
            const projectOwnerId = String(project.ownerId || "");
            return projectClientId === userId || projectOwnerId === userId;
          })
          .map(
            (project: any): DashboardProject => ({
              id: String(project.id || project._id || ""),
              title: project.title || "Project",
              status: (project.status || "open") as DashboardProject["status"],
              budget: Number(project.budget || 0),
              updatedAt: project.updatedAt || project.createdAt,
              engineerId: project.engineer_id || null,
            }),
          );

        const mappedConversations = (
          Array.isArray(conversationsData) ? conversationsData : []
        ).map(
          (conversation: any): DashboardConversation => ({
            id: String(conversation.id || conversation._id || ""),
            unreadCount: Number(conversation.unreadCount || 0),
          }),
        );

        const suggestedEngineers = (
          Array.isArray(engineersData) ? engineersData : []
        )
          .slice(0, 3)
          .map(
            (engineer: any): SuggestedEngineer => ({
              id: String(engineer.id || engineer._id || ""),
              name: engineer.name || "Engineer",
              title: engineer.title,
              specialization: engineer.specialization,
            }),
          );

        const bidsEntries = await Promise.all(
          clientProjects.map(async (project) => {
            try {
              const bidsRes = await fetch(`/api/bids/project/${project.id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              const bidsText = await bidsRes.text();
              const bidsData = bidsText ? JSON.parse(bidsText) : [];

              if (!bidsRes.ok) {
                return [project.id, []] as const;
              }

              const mapped = (Array.isArray(bidsData) ? bidsData : []).map(
                (bid: any): ProjectBid => ({
                  id: String(bid.id || bid._id || ""),
                  engineerId: String(bid.engineerId || ""),
                  engineerName: bid.engineerName || "Engineer",
                  engineerTitle: bid.engineerTitle || "Civil Engineer",
                  amount: Number(bid.amount || 0),
                  status: String(bid.status || "pending"),
                  proposal: bid.proposal || "",
                  deadline: bid.deadline,
                  submittedAt: bid.submittedAt,
                }),
              );

              return [project.id, mapped] as const;
            } catch {
              return [project.id, []] as const;
            }
          }),
        );

        const notificationsRes = await fetch("/api/notifications", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const notificationsText = await notificationsRes.text();
        const notificationsData = notificationsText
          ? JSON.parse(notificationsText)
          : null;

        if (!notificationsRes.ok) {
          throw new Error(
            notificationsData?.message || "Unable to load notifications",
          );
        }

        if (isMounted) {
          setProjects(clientProjects);
          setConversations(mappedConversations);
          setEngineers(suggestedEngineers);
          setProjectBids(Object.fromEntries(bidsEntries));
          setUnreadNotifications(Number(notificationsData?.unreadCount || 0));
          setNotifications(
            (notificationsData?.items || []).map((item: any) => ({
              id: String(item.id || item._id || ""),
              title: item.title || "Notification",
              message: item.message || "",
              read: Boolean(item.read),
              createdAt: item.createdAt || "",
            })),
          );
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard data",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [refreshSeed, token, userId]);

  async function awardBid(bidId: string) {
    try {
      const res = await fetch(`/api/bids/${bidId}/award`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to award bid");
      }

      setRefreshSeed((value) => value + 1);
      window.alert("Bid awarded and project moved to In Progress.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to award bid");
    }
  }

  async function markProjectCompleted(projectId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "completed" }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || "Unable to complete project");
      }

      setRefreshSeed((value) => value + 1);
      window.alert("Project marked as completed.");
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to complete project",
      );
    }
  }

  const openRequests = useMemo(
    () => projects.filter((project) => project.status === "open").length,
    [projects],
  );

  const quotesReceived = useMemo(
    () => projects.filter((project) => Boolean(project.engineerId)).length,
    [projects],
  );

  const activeChats = conversations.length;
  const topProjects = projects.slice(0, 3);
  const unreadMessages = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Client Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your projects, quotes, and engineer conversations in one
            place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#1E88E5]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Open Requests</h3>
              <Briefcase size={24} className="text-[#1E88E5]" />
            </div>
            <p className="text-4xl font-bold text-[#1A1A1A]">
              {loading ? "-" : openRequests}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF8F00]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Quotes Received</h3>
              <Calculator size={24} className="text-[#FF8F00]" />
            </div>
            <p className="text-4xl font-bold text-[#1A1A1A]">
              {loading ? "-" : quotesReceived}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Active Chats</h3>
              <MessageSquare size={24} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-[#1A1A1A]">
              {loading ? "-" : activeChats}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Project Requests
            </h2>
            <div className="space-y-4">
              {topProjects.map((project) => (
                <div key={project.id} className="border-b last:border-b-0 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {mapProjectStatus(
                          project.status,
                          Boolean(project.engineerId),
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#1E88E5]">
                      BDT {formatCurrency(project.budget)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock size={14} />
                    <span>Updated {formatUpdatedLabel(project.updatedAt)}</span>
                  </div>

                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Bid Comparison
                    </p>

                    {(projectBids[project.id] || []).length === 0 ? (
                      <p className="text-sm text-gray-600">
                        No bids received for this project yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {(projectBids[project.id] || []).map((bid) => (
                          <div
                            key={bid.id}
                            className="flex items-start justify-between gap-3 rounded border border-gray-200 bg-white p-2"
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A1A]">
                                {bid.engineerName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {bid.engineerTitle}
                              </p>
                              {bid.proposal ? (
                                <p className="mt-1 text-xs text-gray-700">
                                  {bid.proposal}
                                </p>
                              ) : null}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#1E88E5]">
                                BDT {formatCurrency(bid.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {String(bid.status)
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase(),
                                  )}
                              </p>
                              {project.status !== "completed" &&
                              bid.status !== "won" &&
                              bid.status !== "lost" &&
                              bid.status !== "withdrawn" ? (
                                <button
                                  type="button"
                                  className="mt-1 rounded bg-[#1E88E5] px-2 py-1 text-xs font-semibold text-white hover:bg-[#1565C0]"
                                  onClick={() => awardBid(bid.id)}
                                >
                                  Award
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {project.status === "in_progress" ? (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                        onClick={() => markProjectCompleted(project.id)}
                      >
                        Mark Completed
                      </button>
                      <Link
                        to={`/projects/${project.id}/progress`}
                        className="rounded border border-[#1E88E5] px-3 py-1 text-xs font-semibold text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white"
                      >
                        Track Progress
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Link
                        to={`/projects/${project.id}/progress`}
                        className="rounded border border-[#1E88E5] px-3 py-1 text-xs font-semibold text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white"
                      >
                        Track Progress
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {!loading && topProjects.length === 0 ? (
                <p className="text-sm text-gray-500">No projects posted yet.</p>
              ) : null}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Recommended Engineers
            </h2>
            <div className="space-y-4">
              {engineers.map((engineer) => (
                <div key={engineer.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                    <Users size={18} className="text-[#1E88E5]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">
                      {engineer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {engineer.title ||
                        engineer.specialization ||
                        "Civil Engineer"}
                    </p>
                  </div>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
              ))}
              {!loading && engineers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No engineer profiles available yet.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="rounded-lg bg-gray-50 p-4">
              Review incoming quotations and shortlist one engineer.
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              Continue active chats with shortlisted engineers.
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              You currently have {unreadMessages} unread message(s).
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-[#1A1A1A]">Notifications</h3>
              <span className="rounded-full bg-[#1E88E5]/10 px-2 py-0.5 text-xs font-semibold text-[#1E88E5]">
                {unreadNotifications} unread
              </span>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600">{item.message}</p>
                </div>
              ))}
              {!loading && notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications yet.</p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

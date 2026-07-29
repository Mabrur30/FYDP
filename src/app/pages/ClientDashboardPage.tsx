import { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            fetch("/api/projects"),
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

        if (isMounted) {
          setProjects(clientProjects);
          setConversations(mappedConversations);
          setEngineers(suggestedEngineers);
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
  }, [token, userId]);

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
        </section>
      </main>

      <Footer />
    </div>
  );
}

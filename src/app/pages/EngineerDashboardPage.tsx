import { useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
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
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";

export function EngineerDashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "overview" | "projects" | "bids" | "messages" | "earnings" | "profile"
  >("overview");

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", value: "overview" as const },
    { icon: FileText, label: "Projects", value: "projects" as const },
    { icon: Gavel, label: "Bids", value: "bids" as const },
    { icon: MessageSquare, label: "Messages", value: "messages" as const },
    { icon: DollarSign, label: "Earnings", value: "earnings" as const },
    { icon: User, label: "Profile", value: "profile" as const },
  ];

  const projects = [
    {
      id: 1,
      name: "5-Story Residential Building",
      client: "Ahmed Corporation",
      status: "In Progress",
      budget: "32,50,000",
      progress: 65,
      deadline: "2026-06-15",
    },
    {
      id: 2,
      name: "Commercial Plaza Construction",
      client: "Rahman Builders",
      status: "In Progress",
      budget: "85,00,000",
      progress: 40,
      deadline: "2026-09-20",
    },
    {
      id: 3,
      name: "Bridge Foundation Design",
      client: "City Development",
      status: "Review",
      budget: "12,50,000",
      progress: 90,
      deadline: "2026-04-10",
    },
    {
      id: 4,
      name: "Highway Expansion Project",
      client: "Government Works",
      status: "Completed",
      budget: "1,20,00,000",
      progress: 100,
      deadline: "2026-03-01",
    },
  ];

  const bids = [
    {
      id: 1,
      project: "10-Story Apartment Complex",
      client: "Housing Ltd",
      budget: "50,00,000 - 60,00,000",
      deadline: "2026-05-10",
      status: "Pending",
      submitted: "2026-04-25",
    },
    {
      id: 2,
      project: "Shopping Mall Structural Design",
      client: "Retail Corp",
      budget: "95,00,000",
      deadline: "2026-05-20",
      status: "Under Review",
      submitted: "2026-04-20",
    },
    {
      id: 3,
      project: "Industrial Warehouse",
      client: "Logistics BD",
      budget: "40,00,000",
      deadline: "2026-05-15",
      status: "Shortlisted",
      submitted: "2026-04-18",
    },
  ];

  const conversations = [
    {
      id: 1,
      name: "Ahmed Corporation",
      lastMessage: "Can we schedule a meeting for tomorrow?",
      time: "2 min ago",
      unread: 2,
      avatar:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Rahman Builders",
      lastMessage: "The revised blueprints look great!",
      time: "1 hour ago",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "City Development",
      lastMessage: "Payment has been processed",
      time: "3 hours ago",
      unread: 1,
      avatar:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
    },
  ];

  const earnings = [
    {
      id: 1,
      project: "5-Story Residential Building",
      amount: "15,00,000",
      status: "Paid",
      date: "2026-04-15",
      type: "Milestone Payment",
    },
    {
      id: 2,
      project: "Highway Expansion Project",
      amount: "30,00,000",
      status: "Paid",
      date: "2026-03-10",
      type: "Final Payment",
    },
    {
      id: 3,
      project: "Commercial Plaza Construction",
      amount: "12,00,000",
      status: "Pending",
      date: "2026-04-30",
      type: "Milestone Payment",
    },
    {
      id: 4,
      project: "Bridge Foundation Design",
      amount: "8,50,000",
      status: "Processing",
      date: "2026-05-05",
      type: "Milestone Payment",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen border-r sticky top-20">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => setActiveSection(item.value)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.value
                        ? "bg-[#1E88E5] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
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
                  <p className="text-4xl font-bold text-[#1A1A1A]">3</p>
                  <p className="text-sm text-green-600 mt-2">
                    ↑ 2 from last month
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF8F00]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600">Pending Bids</h3>
                    <Gavel size={24} className="text-[#FF8F00]" />
                  </div>
                  <p className="text-4xl font-bold text-[#1A1A1A]">3</p>
                  <p className="text-sm text-blue-600 mt-2">
                    New opportunities
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600">Total Earnings</h3>
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                  <p className="text-4xl font-bold text-[#1A1A1A]">65.5L</p>
                  <p className="text-sm text-gray-600 mt-2">Total</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600">Completion Rate</h3>
                    <TrendingUp size={24} className="text-purple-500" />
                  </div>
                  <p className="text-4xl font-bold text-[#1A1A1A]">96%</p>
                  <p className="text-sm text-green-600 mt-2">Excellent</p>
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
                              className="bg-[#1E88E5] h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
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
                    onClick={() => setActiveSection("projects")}
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
                        className="flex gap-3 border-b pb-4 last:border-b-0"
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
                              {conv.time}
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
                    onClick={() => setActiveSection("messages")}
                    className="mt-4 w-full text-[#1E88E5] font-semibold hover:underline"
                  >
                    View All Messages →
                  </button>
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
                                className="bg-[#1E88E5] h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#1E88E5] border-[#1E88E5]"
                          >
                            View Details
                          </Button>
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
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">My Bids</h2>
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
                          <p className="text-gray-600">Client: {bid.client}</p>
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
                          <p className="text-sm text-gray-600">Budget Range</p>
                          <p className="font-semibold text-[#1A1A1A]">
                            BDT {bid.budget}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted On</p>
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
                        >
                          Edit Bid
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                  Available Projects
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse and submit bids for new construction projects
                </p>
                <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white">
                  Browse All Projects
                </Button>
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === "messages" && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-200px)]">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Messages</h2>
              </div>
              <div className="grid grid-cols-3 h-full">
                <div className="col-span-1 border-r overflow-y-auto">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
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
                            {conv.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-2 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare
                      size={48}
                      className="text-gray-400 mx-auto mb-4"
                    />
                    <p className="text-gray-600">
                      Select a conversation to view messages
                    </p>
                  </div>
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
                <div className="flex items-start gap-6 mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                      Md. Kamal Hossain
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      Senior Structural Engineer
                    </p>
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Star
                          className="text-[#FF8F00] fill-current"
                          size={20}
                        />
                        <span className="font-semibold">4.9 Rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="text-[#1E88E5]" size={20} />
                        <span className="font-semibold">
                          12 Projects Completed
                        </span>
                      </div>
                    </div>
                    <Button className="bg-[#1E88E5] hover:bg-[#1565C0] text-white">
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail size={20} className="text-[#1E88E5]" />
                        <span>kamal.hossain@email.com</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone size={20} className="text-[#1E88E5]" />
                        <span>+880 1712-345678</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin size={20} className="text-[#1E88E5]" />
                        <span>Dhaka, Bangladesh</span>
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
                        <span>15+ years experience</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Award size={20} className="text-[#1E88E5]" />
                        <span>BUET Civil Engineering</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={20} className="text-[#1E88E5]" />
                        <span>Member since 2020</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Experienced structural engineer specializing in high-rise
                    buildings and complex infrastructure projects. Proven track
                    record of delivering quality designs on time and within
                    budget. Expert in seismic design, foundation engineering,
                    and sustainable construction practices. Passionate about
                    innovative solutions for Bangladesh's growing construction
                    industry.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "High-Rise Buildings",
                      "Bridge Design",
                      "Seismic Analysis",
                      "Foundation Engineering",
                      "Sustainable Design",
                      "BIM Modeling",
                    ].map((skill) => (
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
        </main>
      </div>

      <Footer />
    </div>
  );
}

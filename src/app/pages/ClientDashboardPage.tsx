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

const requests = [
  {
    id: 1,
    title: "Residential Building Estimate",
    status: "Awaiting Engineer Match",
    budget: "18,00,000",
    updated: "Today",
  },
  {
    id: 2,
    title: "Office Renovation",
    status: "Quotation Received",
    budget: "9,50,000",
    updated: "2 days ago",
  },
  {
    id: 3,
    title: "Boundary Wall Design",
    status: "In Review",
    budget: "2,20,000",
    updated: "This week",
  },
];

const engineers = [
  "Md. Karim - Structural Engineer",
  "Nusrat Jahan - Project Manager",
  "Aminul Islam - Geotechnical Engineer",
];

export function ClientDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <p className="text-4xl font-bold text-[#1A1A1A]">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF8F00]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Quotes Received</h3>
              <Calculator size={24} className="text-[#FF8F00]" />
            </div>
            <p className="text-4xl font-bold text-[#1A1A1A]">8</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Active Chats</h3>
              <MessageSquare size={24} className="text-green-500" />
            </div>
            <p className="text-4xl font-bold text-[#1A1A1A]">5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Project Requests
            </h2>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border-b last:border-b-0 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.status}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#1E88E5]">
                      {request.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock size={14} />
                    <span>Updated {request.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Recommended Engineers
            </h2>
            <div className="space-y-4">
              {engineers.map((engineer, index) => (
                <div key={engineer} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                    <Users size={18} className="text-[#1E88E5]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{engineer}</p>
                    <p className="text-sm text-gray-600">
                      {index === 0
                        ? "Structural design"
                        : index === 1
                          ? "Project planning"
                          : "Foundation work"}
                    </p>
                  </div>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="rounded-lg bg-gray-50 p-4">
              Review new quotations and shortlist one engineer.
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              Schedule a consultation to finalize scope and budget.
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              Share drawings and files through your project chat.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

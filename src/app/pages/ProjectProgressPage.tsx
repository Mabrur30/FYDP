import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthToken } from "../utils/auth";
import type { ProjectProgressResponse } from "../types/progress";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPhaseStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ProjectProgressPage() {
  const { id } = useParams();
  const token = getAuthToken();

  const [progress, setProgress] = useState<ProjectProgressResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      if (!id) {
        if (isMounted) {
          setLoading(false);
          setError("No project id provided.");
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/projects/${id}/progress`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load project progress");
        }

        if (isMounted) {
          setProgress(data as ProjectProgressResponse);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load project progress",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            Project Progress
          </h1>
          <p className="mt-2 text-gray-600">
            Track current phase status, deadlines, and completion percentage.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E88E5]" />
            <p className="text-sm text-gray-600">Loading project progress...</p>
          </div>
        ) : progress ? (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Project ID</p>
                <p className="mt-1 font-semibold text-[#1A1A1A]">
                  {progress.projectId}
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Overall Status</p>
                <p className="mt-1 font-semibold text-[#1A1A1A]">
                  {formatPhaseStatus(progress.overallStatus)}
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Overall Completion</p>
                <p className="mt-1 font-semibold text-[#1A1A1A]">
                  {progress.overallPercentComplete}%
                </p>
              </div>
            </section>

            <section className="rounded-xl bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Phases</h2>
              </div>
              <div className="divide-y">
                {progress.phases.length === 0 ? (
                  <div className="px-6 py-6 text-sm text-gray-600">
                    No phases are configured for this project yet.
                  </div>
                ) : (
                  progress.phases.map((phase) => (
                    <div key={phase.id} className="px-6 py-4">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">
                            {phase.order}. {phase.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: {formatPhaseStatus(phase.status)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1E88E5]">
                            {phase.percentComplete}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(phase.dueDate)}
                          </p>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-[#1E88E5]"
                          style={{ width: `${phase.percentComplete}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Completed:{" "}
                        {phase.completedAt
                          ? formatDate(phase.completedAt)
                          : "Not completed"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

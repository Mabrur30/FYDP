// Keep this in sync with frontend: src/app/types/progress.ts

export type ProjectProgressStatus =
  | "not_started"
  | "in_progress"
  | "delayed"
  | "awaiting_approval"
  | "completed";

export interface ProjectProgressResponse {
  projectId: string;
  overallStatus: "open" | "in_progress" | "completed";
  overallPercentComplete: number;
  phases: {
    id: string;
    name: string;
    order: number;
    status: ProjectProgressStatus;
    percentComplete: number;
    dueDate: string;
    completedAt: string | null;
  }[];
}

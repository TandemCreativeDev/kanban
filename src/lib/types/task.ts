export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  labels?: string[];
  assignee?: string;
  estimatedCompletion?: string; // ISO date string
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface Task {
  id: string;              // Unique identifier
  title: string;           // Task title (required)
  description?: string;    // Optional description
  status: "todo" | "doing" | "done";  // Current column
  labels?: string[];       // Optional array of labels
  assignee?: string;       // Optional assignee name
  estimatedCompletion?: Date; // Estimated completion date
  completedAt?: Date;      // When the task was marked as done
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}

export type TaskStatus = "todo" | "doing" | "done";

export interface NewTask extends Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  // Fields required when creating a new task
  title: string;
  status: TaskStatus;
}

export interface TaskUpdate extends Partial<Omit<Task, 'id' | 'createdAt'>> {
  // Fields that can be updated
  updatedAt: Date;
}
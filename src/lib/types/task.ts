export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  labels?: string[];
  assignee?: string;
  estimatedCompletion?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface NewTask extends Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  // Fields required when creating a new task
  title: string;
  status: TaskStatus;
}

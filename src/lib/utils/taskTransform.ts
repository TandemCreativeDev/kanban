import type { Task, TaskStatus } from '$lib/types/task';

/**
 * Utility functions for transforming task data
 */
export const taskTransform = {
  /**
   * Handle status changes and update timestamps accordingly
   * When a task is moved to 'done', add completedAt
   * When a task is moved from 'done', remove completedAt
   */
  prepareTaskUpdate: (task: Task, updatedFields: Partial<Task>): Partial<Task> => {
    const fields = { ...updatedFields };
    
    // If moving to "done" status, add completedAt timestamp
    if (fields.status === 'done' && task.status !== 'done') {
      fields.completedAt = new Date();
    }
    // If moving from "done" status, remove completedAt timestamp
    else if (fields.status && fields.status !== 'done' && task.status === 'done') {
      fields.completedAt = undefined;
    }
    
    // Always update the updatedAt timestamp
    fields.updatedAt = new Date();
    
    return fields;
  },
  
  /**
   * Create a new task with default timestamps
   */
  prepareNewTask: (taskData: Record<string, unknown>): Task => {
    const now = new Date();
    return {
      ...taskData,
      id: crypto.randomUUID(),
      status: taskData.status as TaskStatus,
      createdAt: now,
      updatedAt: now,
      completedAt: taskData.status === 'done' ? now : undefined
    } as Task;
  },
  
  /**
   * Apply updates to a task object
   */
  applyUpdates: (task: Task, updates: Partial<Task>): Task => {
    return { ...task, ...updates };
  }
};
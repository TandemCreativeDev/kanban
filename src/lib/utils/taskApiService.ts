import type { Task, NewTask } from '$lib/types/task';

/**
 * API service for task operations
 * Centralizes all HTTP requests to the tasks API
 */
export const taskApiService = {
  /**
   * Fetch all tasks from the API
   */
  fetchAllTasks: async (): Promise<Task[]> => {
    const response = await fetch('/api/tasks');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  /**
   * Create a new task via the API
   */
  createTask: async (newTask: NewTask): Promise<Task> => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }

    return response.json();
  },
  
  /**
   * Update an existing task via the API
   */
  updateTask: async (taskId: string, updatedFields: Partial<Task>): Promise<Task> => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields)
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }

    return response.json();
  },
  
  /**
   * Delete a task via the API
   */
  deleteTask: async (taskId: string): Promise<boolean> => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
    
    return true;
  }
};
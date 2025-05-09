import { writable, derived, get } from 'svelte/store';
import type { Task, NewTask, TaskStatus } from '$lib/types/task';

// Create the main tasks store
const tasksStore = writable<Task[]>([]);

// Create a loading state store
export const isLoading = writable<boolean>(false);

// Create an error state store
export const taskError = writable<string | null>(null);

// Status count stores
export const todoCount = derived(tasksStore, $tasks => 
  $tasks.filter(task => task.status === 'todo').length
);

export const doingCount = derived(tasksStore, $tasks => 
  $tasks.filter(task => task.status === 'doing').length
);

export const doneCount = derived(tasksStore, $tasks => 
  $tasks.filter(task => task.status === 'done').length
);

// Create the task store with methods
export const taskStore = {
  subscribe: tasksStore.subscribe,
  
  // Initialize the store with tasks from the API
  init: async () => {
    try {
      // Set loading state
      isLoading.set(true);
      taskError.set(null);
      
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      
      const tasks = await response.json();
      tasksStore.set(tasks);
      
      return tasks;
    } catch (error) {
      console.error('Error initializing task store:', error);
      taskError.set(error instanceof Error ? error.message : 'Unknown error');
      tasksStore.set([]);
      return [];
    } finally {
      isLoading.set(false);
    }
  },
  
  // Add a new task
  addTask: async (newTask: NewTask) => {
    try {
      isLoading.set(true);
      taskError.set(null);
      
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

      const createdTask = await response.json();
      
      // Update the store with the new task
      tasksStore.update(tasks => [...tasks, createdTask]);
      
      return createdTask;
    } catch (error) {
      console.error('Error adding task:', error);
      taskError.set(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      isLoading.set(false);
    }
  },
  
  // Update an existing task
  updateTask: async (taskId: string, updatedFields: Partial<Task>) => {
    try {
      taskError.set(null);
      
      // Get the current task before updating
      const currentTasks = get(tasksStore);
      const taskToUpdate = currentTasks.find(task => task.id === taskId);
      
      if (!taskToUpdate) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // First update locally for optimistic UI
      let updatedTask: Task | null = null;
      
      tasksStore.update(tasks => {
        return tasks.map(task => {
          if (task.id === taskId) {
            // If moving to "done" status, add completedAt timestamp
            if (updatedFields.status === 'done' && task.status !== 'done') {
              updatedFields.completedAt = new Date();
            }
            // If moving from "done" status, remove completedAt timestamp
            else if (updatedFields.status && updatedFields.status !== 'done' && task.status === 'done') {
              updatedFields.completedAt = undefined;
            }
            
            // Always update the updatedAt timestamp
            updatedFields.updatedAt = new Date();
            
            // Create the updated task
            updatedTask = { ...task, ...updatedFields };
            return updatedTask;
          }
          return task;
        });
      });
      
      // Then update on the server
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        // Revert to original state in case of error
        tasksStore.update(tasks => 
          tasks.map(task => task.id === taskId ? taskToUpdate : task)
        );
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const serverTask = await response.json();
      
      // Update again with server response (in case any fields were changed)
      tasksStore.update(tasks => tasks.map(task => task.id === taskId ? serverTask : task));
      
      return serverTask;
    } catch (error) {
      console.error('Error updating task:', error);
      taskError.set(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (taskId: string) => {
    try {
      taskError.set(null);
      
      // Get the current task before deleting
      const currentTasks = get(tasksStore);
      const taskToDelete = currentTasks.find(task => task.id === taskId);
      
      if (!taskToDelete) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // First update locally for optimistic UI
      tasksStore.update(tasks => tasks.filter(task => task.id !== taskId));
      
      // Then delete on the server
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        // Revert deletion if server request fails
        tasksStore.update(tasks => [...tasks, taskToDelete]);
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      taskError.set(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Update task status (specialized method for drag and drop)
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus) => {
    return taskStore.updateTask(taskId, { status: newStatus });
  },
  
  // Get task by ID (synchronous helper method)
  getTaskById: (taskId: string) => {
    const tasks = get(tasksStore);
    return tasks.find(task => task.id === taskId);
  },
  
  // Clear all errors
  clearError: () => {
    taskError.set(null);
  }
};

// Derived stores for each column with sorting
export const todoTasks = derived(tasksStore, $tasks => 
  $tasks
    .filter(task => task.status === 'todo')
    .sort((a, b) => {
      // Sort by estimated completion date (closest first)
      const aDate = a.estimatedCompletion ? new Date(a.estimatedCompletion).getTime() : Infinity;
      const bDate = b.estimatedCompletion ? new Date(b.estimatedCompletion).getTime() : Infinity;
      return aDate - bDate;
    })
);

export const doingTasks = derived(tasksStore, $tasks => 
  $tasks
    .filter(task => task.status === 'doing')
    .sort((a, b) => {
      // Sort by estimated completion date (closest first)
      const aDate = a.estimatedCompletion ? new Date(a.estimatedCompletion).getTime() : Infinity;
      const bDate = b.estimatedCompletion ? new Date(b.estimatedCompletion).getTime() : Infinity;
      return aDate - bDate;
    })
);

export const doneTasks = derived(tasksStore, $tasks => 
  $tasks
    .filter(task => task.status === 'done')
    .sort((a, b) => {
      // Sort by completion date (most recent first)
      const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bDate - aDate;
    })
);
import { writable, derived } from 'svelte/store';
import type { Task, NewTask, TaskStatus } from '$lib/types/task';

// Create the main tasks store
const tasksStore = writable<Task[]>([]);

// Create the task store with methods
export const taskStore = {
  subscribe: tasksStore.subscribe,
  
  // Initialize the store with tasks from the API
  init: async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      tasksStore.set(tasks);
      return tasks;
    } catch (error) {
      console.error('Error initializing task store:', error);
      tasksStore.set([]);
      return [];
    }
  },
  
  // Add a new task
  addTask: async (newTask: NewTask) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      
      // Update the store with the new task
      tasksStore.update(tasks => [...tasks, createdTask]);
      
      return createdTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },
  
  // Update an existing task
  updateTask: async (taskId: string, updatedFields: Partial<Task>) => {
    try {
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
        throw new Error('Failed to update task');
      }

      const serverTask = await response.json();
      
      // Update again with server response (in case any fields were changed)
      tasksStore.update(tasks => tasks.map(task => task.id === taskId ? serverTask : task));
      
      return serverTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (taskId: string) => {
    try {
      // First update locally for optimistic UI
      tasksStore.update(tasks => tasks.filter(task => task.id !== taskId));
      
      // Then delete on the server
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
  
  // Update task status (specialized method for drag and drop)
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus) => {
    return taskStore.updateTask(taskId, { status: newStatus });
  }
};

// Derived stores for each column
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
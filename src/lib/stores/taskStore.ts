import { get } from 'svelte/store';
import type { Task, NewTask, TaskStatus } from '$lib/types/task';
import { taskApiService } from '$lib/utils/taskApiService';
import { taskTransform } from '$lib/utils/taskTransform';
import { storeFactory } from '$lib/utils/storeFactory';

// Create the main stores
const tasksStore = storeFactory.createTasksStore();
export const isLoading = storeFactory.createLoadingStore();
export const taskError = storeFactory.createErrorStore();

// Create derived stores for columns
export const todoTasks = storeFactory.createColumnStore(tasksStore, 'todo');
export const doingTasks = storeFactory.createColumnStore(tasksStore, 'doing');
export const doneTasks = storeFactory.createColumnStore(tasksStore, 'done');

// Create derived stores for counts
export const todoCount = storeFactory.createCountStore(tasksStore, 'todo');
export const doingCount = storeFactory.createCountStore(tasksStore, 'doing');
export const doneCount = storeFactory.createCountStore(tasksStore, 'done');

// Create the task store with methods
export const taskStore = {
  // Expose subscribe method from the underlying store
  subscribe: tasksStore.subscribe,

  // Initialize the store with tasks from the API
  init: async () => {
    try {
      isLoading.set(true);
      taskError.set(null);

      const tasks = await taskApiService.fetchAllTasks();
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

      const createdTask = await taskApiService.createTask(newTask);

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

      // Prepare updates with proper transformations
      const preparedUpdates = taskTransform.prepareTaskUpdate(taskToUpdate, updatedFields);

      // Apply optimistic update
      tasksStore.update(tasks => {
        return tasks.map(task => {
          if (task.id === taskId) {
            return taskTransform.applyUpdates(task, preparedUpdates);
          }
          return task;
        });
      });

      try {
        // Update on the server
        const serverTask = await taskApiService.updateTask(taskId, preparedUpdates);

        // Update again with server response
        tasksStore.update(tasks => tasks.map(task => (task.id === taskId ? serverTask : task)));

        return serverTask;
      } catch (error) {
        // Revert to original state in case of error
        tasksStore.update(tasks => tasks.map(task => (task.id === taskId ? taskToUpdate : task)));
        throw error;
      }
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

      try {
        // Delete on the server
        await taskApiService.deleteTask(taskId);
        return true;
      } catch (error) {
        // Revert deletion if server request fails
        tasksStore.update(tasks => [...tasks, taskToDelete]);
        throw error;
      }
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


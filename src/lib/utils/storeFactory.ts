import { writable, derived, type Writable, type Readable } from 'svelte/store';
import type { Task, TaskStatus } from '$lib/types/task';
import { sortTasks } from './taskSort';

/**
 * Factory functions for creating and managing stores
 */
export const storeFactory = {
  /**
   * Create the main tasks store
   */
  createTasksStore: (): Writable<Task[]> => {
    return writable<Task[]>([]);
  },
  
  /**
   * Create a loading state store
   */
  createLoadingStore: (): Writable<boolean> => {
    return writable<boolean>(false);
  },
  
  /**
   * Create an error state store
   */
  createErrorStore: (): Writable<string | null> => {
    return writable<string | null>(null);
  },
  
  /**
   * Create a derived store for tasks in a specific column
   */
  createColumnStore: (tasksStore: Readable<Task[]>, status: TaskStatus): Readable<Task[]> => {
    return derived(tasksStore, $tasks => sortTasks($tasks, status));
  },
  
  /**
   * Create a derived store for column counts
   */
  createCountStore: (tasksStore: Readable<Task[]>, status: TaskStatus): Readable<number> => {
    return derived(tasksStore, $tasks => 
      $tasks.filter(task => task.status === status).length
    );
  }
};
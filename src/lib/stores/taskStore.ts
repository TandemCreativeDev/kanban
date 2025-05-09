import { writable } from 'svelte/store';
import type { Task } from '$lib/types/task';

// Create a writable store with initial empty array
export const tasks = writable<Task[]>([]);

// Later this will be connected to the API
// For now, we'll use these methods to manage tasks locally
export const taskStore = {
  // Load tasks from API (placeholder for now)
  loadTasks: async () => {
    try {
      // This will be replaced with API call
      const dummyTasks: Task[] = [
        {
          id: '1',
          title: 'Create Board Component',
          description: 'Implement the main Kanban board',
          status: 'todo',
          labels: ['frontend', 'ui'],
          assignee: 'Jack',
          estimatedCompletion: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Implement API Routes',
          description: 'Create endpoints for task CRUD operations',
          status: 'doing',
          labels: ['backend', 'api'],
          assignee: 'Max',
          estimatedCompletion: new Date(Date.now() + 172800000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Project Setup',
          description: 'Initialize SvelteKit project and configure Tailwind',
          status: 'done',
          labels: ['setup'],
          assignee: 'Max',
          completedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      tasks.set(dummyTasks);
      return dummyTasks;
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  },
  
  // Add task (placeholder)
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.update(currentTasks => [...currentTasks, newTask]);
    return newTask;
  },
  
  // Update task (placeholder)
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    let updatedTask: Task | undefined;
    
    tasks.update(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === id) {
          // If moving to done, set completedAt
          if (updates.status === 'done' && task.status !== 'done') {
            updates.completedAt = new Date().toISOString();
          }
          
          // If moving out of done, remove completedAt
          if (updates.status && updates.status !== 'done' && task.status === 'done') {
            updates.completedAt = undefined;
          }
          
          updatedTask = { 
            ...task, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          return updatedTask;
        }
        return task;
      });
    });
    
    return updatedTask;
  },
  
  // Delete task (placeholder)
  deleteTask: (id: string) => {
    tasks.update(currentTasks => currentTasks.filter(task => task.id !== id));
  }
};
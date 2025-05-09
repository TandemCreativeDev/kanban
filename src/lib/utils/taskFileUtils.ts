import fs from 'node:fs';
import path from 'node:path';
import type { Task } from '$lib/types/task';

// Path to the tasks.json file in the static directory
export const tasksFilePath = path.join(process.cwd(), 'static/data/tasks.json');

// Helper function to create error responses
export const errorResponse = (message: string, status: number = 500) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Helper function to read tasks from file
export const readTasks = (): Task[] => {
  // Check if the file exists, create it if it doesn't
  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, '[]', 'utf-8');
    return [];
  }

  // Read the tasks from the JSON file
  const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
  const tasks = JSON.parse(tasksData);

  // Convert date strings to Date objects
  return tasks.map((task: Task) => {
    // Convert string dates to Date objects
    if (task.estimatedCompletion && typeof task.estimatedCompletion === 'string') {
      task.estimatedCompletion = new Date(task.estimatedCompletion);
    }
    if (task.completedAt && typeof task.completedAt === 'string') {
      task.completedAt = new Date(task.completedAt);
    }
    if (task.createdAt && typeof task.createdAt === 'string') {
      task.createdAt = new Date(task.createdAt);
    }
    if (task.updatedAt && typeof task.updatedAt === 'string') {
      task.updatedAt = new Date(task.updatedAt);
    }
    return task;
  });
};

/**
 * Helper function to write tasks to file
 * Converts Date objects to ISO strings for JSON serialization
 */
export const writeTasks = (tasks: Task[]): void => {
  // Deep clone and convert all Date objects to strings for JSON serialization
  const tasksToWrite = tasks.map(task => {
    // Create a new object for serialization
    const serializedTask: Record<string, unknown> = { ...task };

    if (serializedTask.estimatedCompletion instanceof Date) {
      serializedTask.estimatedCompletion = serializedTask.estimatedCompletion.toISOString();
    }
    if (serializedTask.completedAt instanceof Date) {
      serializedTask.completedAt = serializedTask.completedAt.toISOString();
    }
    if (serializedTask.createdAt instanceof Date) {
      serializedTask.createdAt = serializedTask.createdAt.toISOString();
    }
    if (serializedTask.updatedAt instanceof Date) {
      serializedTask.updatedAt = serializedTask.updatedAt.toISOString();
    }

    return serializedTask;
  });

  fs.writeFileSync(tasksFilePath, JSON.stringify(tasksToWrite, null, 2), 'utf-8');
};

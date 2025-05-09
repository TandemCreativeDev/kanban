import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';
import type { Task, TaskStatus } from '$lib/types/task';

// Path to the tasks.json file in the static directory
const tasksFilePath = path.join(process.cwd(), 'static/data/tasks.json');

/**
 * GET handler for /api/tasks
 * Returns all tasks
 */
export const GET: RequestHandler = async () => {
  try {
    // Check if the file exists, create it if it doesn't
    if (!fs.existsSync(tasksFilePath)) {
      fs.writeFileSync(tasksFilePath, '[]', 'utf-8');
    }

    // Read the tasks from the JSON file
    const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
    const tasks: Task[] = JSON.parse(tasksData);

    // Sort tasks according to requirements:
    // - "todo" and "doing": sort by estimatedCompletion (closest dates first)
    // - "done": sort by completedAt (most recently completed first)
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.status === 'done' && b.status === 'done') {
        // Sort "done" tasks by completedAt (most recent first)
        const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bDate - aDate; // Descending order (newest first)
      } else if (a.status !== 'done' && b.status !== 'done') {
        // Sort "todo" and "doing" tasks by estimatedCompletion (closest first)
        const aDate = a.estimatedCompletion ? new Date(a.estimatedCompletion).getTime() : Infinity;
        const bDate = b.estimatedCompletion ? new Date(b.estimatedCompletion).getTime() : Infinity;
        return aDate - bDate; // Ascending order (closest first)
      }
      
      // If comparing tasks from different columns, maintain their column positions
      return 0;
    });

    return json(sortedTasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

/**
 * POST handler for /api/tasks
 * Creates a new task
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const taskData = await request.json();
    
    // Validate required fields
    if (!taskData.title || !taskData.status) {
      return new Response(JSON.stringify({ error: 'Title and status are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Read existing tasks
    let tasks: Task[] = [];
    if (fs.existsSync(tasksFilePath)) {
      const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
      tasks = JSON.parse(tasksData);
    }
    
    // Create new task with generated fields
    const now = new Date();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status as TaskStatus,
      labels: taskData.labels || [],
      assignee: taskData.assignee || '',
      estimatedCompletion: taskData.estimatedCompletion ? new Date(taskData.estimatedCompletion) : undefined,
      completedAt: taskData.status === 'done' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };
    
    // Add the new task to the array
    tasks.push(newTask);
    
    // Write updated tasks back to the file
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
    
    return json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: 'Failed to create task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
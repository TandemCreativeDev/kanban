import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';
import type { Task } from '$lib/types/task';

// Path to the tasks.json file in the static directory
const tasksFilePath = path.join(process.cwd(), 'static/data/tasks.json');

/**
 * GET handler for /api/tasks/[id]
 * Returns a single task by ID
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(tasksFilePath)) {
      return new Response(JSON.stringify({ error: 'Tasks file not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Read the tasks from the JSON file
    const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
    const tasks: Task[] = JSON.parse(tasksData);

    // Find the task with the matching ID
    const task = tasks.find(t => t.id === params.id);

    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return json(task);
  } catch (error) {
    console.error(`Error fetching task ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

/**
 * PUT handler for /api/tasks/[id]
 * Updates an existing task
 */
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const updateData = await request.json();
    
    // Check if tasks file exists
    if (!fs.existsSync(tasksFilePath)) {
      return new Response(JSON.stringify({ error: 'Tasks file not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Read existing tasks
    const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
    const tasks: Task[] = JSON.parse(tasksData);
    
    // Find the task to update
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const existingTask = tasks[taskIndex];
    const now = new Date();
    
    // Check if status is changing to 'done'
    const isCompletingTask = existingTask.status !== 'done' && updateData.status === 'done';
    
    // Update the task with new data
    const updatedTask: Task = {
      ...existingTask,
      ...updateData,
      // Preserve these fields that should not be directly updated by client
      id: existingTask.id,
      createdAt: existingTask.createdAt,
      // Update completion date if task is being marked as done
      completedAt: isCompletingTask ? now : existingTask.completedAt,
      // Always update the updatedAt timestamp
      updatedAt: now
    };
    
    // If dates are provided as strings, convert them to Date objects
    if (typeof updatedTask.estimatedCompletion === 'string') {
      updatedTask.estimatedCompletion = new Date(updatedTask.estimatedCompletion);
    }
    if (typeof updatedTask.completedAt === 'string') {
      updatedTask.completedAt = new Date(updatedTask.completedAt);
    }
    if (typeof updatedTask.createdAt === 'string') {
      updatedTask.createdAt = new Date(updatedTask.createdAt);
    }
    if (typeof updatedTask.updatedAt === 'string') {
      updatedTask.updatedAt = new Date(updatedTask.updatedAt);
    }
    
    // Replace the task in the array
    tasks[taskIndex] = updatedTask;
    
    // Write updated tasks back to the file
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
    
    return json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

/**
 * DELETE handler for /api/tasks/[id]
 * Deletes a task by ID
 */
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(tasksFilePath)) {
      return new Response(JSON.stringify({ error: 'Tasks file not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Read existing tasks
    const tasksData = fs.readFileSync(tasksFilePath, 'utf-8');
    const tasks: Task[] = JSON.parse(tasksData);
    
    // Find the task to delete
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Remove the task from the array
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    // Write updated tasks back to the file
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
    
    return json({ success: true, deletedTask });
  } catch (error) {
    console.error(`Error deleting task ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
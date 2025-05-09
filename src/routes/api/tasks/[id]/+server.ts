import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Task } from '$lib/types/task';
import { readTasks, writeTasks, errorResponse } from '$lib/utils/taskFileUtils';

/**
 * GET handler for /api/tasks/[id]
 * Returns a single task by ID
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    const tasks = readTasks();

    // Find the task with the matching ID
    const task = tasks.find(t => t.id === params.id);

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    return json(task);
  } catch (error) {
    console.error(`Error fetching task ${params.id}:`, error);
    return errorResponse('Failed to fetch task');
  }
};

/**
 * PUT handler for /api/tasks/[id]
 * Updates an existing task
 */
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const updateData = await request.json();
    
    // Read existing tasks
    const tasks = readTasks();
    
    // Find the task to update
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return errorResponse('Task not found', 404);
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
    
    // Replace the task in the array
    tasks[taskIndex] = updatedTask;
    
    // Write updated tasks back to the file
    writeTasks(tasks);
    
    return json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${params.id}:`, error);
    return errorResponse('Failed to update task');
  }
};

/**
 * DELETE handler for /api/tasks/[id]
 * Deletes a task by ID
 */
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    // Read existing tasks
    const tasks = readTasks();
    
    // Find the task to delete
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return errorResponse('Task not found', 404);
    }
    
    // Remove the task from the array
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    // Write updated tasks back to the file
    writeTasks(tasks);
    
    return json({ success: true, deletedTask });
  } catch (error) {
    console.error(`Error deleting task ${params.id}:`, error);
    return errorResponse('Failed to delete task');
  }
};
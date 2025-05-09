import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Task, TaskStatus } from '$lib/types/task';
import { readTasks, writeTasks, errorResponse } from '$lib/utils/taskFileUtils';

/**
 * GET handler for /api/tasks
 * Returns all tasks
 */
export const GET: RequestHandler = async () => {
  try {
    const tasks = readTasks();

    // Sort tasks according to requirements:
    // - "todo" and "doing": sort by estimatedCompletion (closest dates first)
    // - "done": sort by completedAt (most recently completed first)
    const sortedTasks = [...tasks].sort((a, b) => {
      const isDoneA = a.status === 'done';
      const isDoneB = b.status === 'done';

      if (isDoneA && isDoneB) {
        // Sort "done" tasks by completedAt (most recent first)
        const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bDate - aDate; // Descending order (newest first)
      } else if (!isDoneA && !isDoneB) {
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
    return errorResponse('Failed to fetch tasks');
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
      return errorResponse('Title and status are required', 400);
    }

    // Read existing tasks
    const tasks = readTasks();

    // Create new task with generated fields
    const now = new Date();
    const newTask: Task = {
      // Include original properties from taskData
      ...taskData,
      // Override or add required properties
      id: crypto.randomUUID(),
      status: taskData.status as TaskStatus,
      // Format dates properly
      estimatedCompletion: taskData.estimatedCompletion
        ? new Date(taskData.estimatedCompletion)
        : undefined,
      completedAt: taskData.status === 'done' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };

    // Add the new task to the array
    tasks.push(newTask);

    // Write updated tasks back to the file
    writeTasks(tasks);

    return json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return errorResponse('Failed to create task');
  }
};

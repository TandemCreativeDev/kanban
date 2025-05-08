import type { Task } from '$lib/types/task';

/**
 * Sort tasks based on column:
 * - Todo/Doing: Sort by estimated completion date (closest first)
 * - Done: Sort by completed date (most recent first)
 */
export function sortTasks(tasks: Task[], status: 'todo' | 'doing' | 'done'): Task[] {
  return [...tasks].filter(task => task.status === status).sort((a, b) => {
    if (status === 'done') {
      // For Done column: sort by completedAt (most recent first)
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA; // Descending order (most recent first)
    } else {
      // For Todo/Doing columns: sort by estimatedCompletion (closest first)
      const dateA = a.estimatedCompletion ? new Date(a.estimatedCompletion).getTime() : Infinity;
      const dateB = b.estimatedCompletion ? new Date(b.estimatedCompletion).getTime() : Infinity;
      return dateA - dateB; // Ascending order (closest first)
    }
  });
}
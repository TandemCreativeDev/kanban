<script lang="ts">
  import type { Task } from '$lib/types/task';
  import { formatDate, isPastDue } from '$lib/utils/dateFormat';
  import { createEventDispatcher } from 'svelte';
  import { taskStore } from '$lib/stores/taskStore';

  export let task: Task;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    edit: void;
    delete: void;
  }>();

  // Handle edit button click
  function handleEdit(event: MouseEvent) {
    event.stopPropagation();
    dispatch('edit');
  }

  // Handle delete button click
  function handleDelete(event: MouseEvent) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      taskStore.deleteTask(task.id);
      dispatch('delete');
    }
  }
</script>

<div
  class="bg-white border rounded-lg p-4 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-move group"
  data-task-id={task.id}
>
  <div class="flex justify-between items-start mb-2">
    <h3 class="font-medium text-gray-800">{task.title}</h3>
    <div class="flex items-center gap-1">
      <div class="text-xs text-gray-500 mr-2">ID: {task.id}</div>
      <div class="hidden group-hover:flex">
        <button
          on:click={handleEdit}
          class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Edit task"
          aria-label="Edit task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          on:click={handleDelete}
          class="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Delete task"
          aria-label="Delete task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {#if task.description}
    <p class="text-sm text-gray-600 mb-2">{task.description}</p>
  {/if}

  <div class="flex flex-wrap gap-1 mb-2">
    {#if task.labels && task.labels.length}
      {#each task.labels as label (label)}
        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {label}
        </span>
      {/each}
    {/if}
  </div>

  <div class="flex justify-between text-xs text-gray-500 mt-2">
    {#if task.assignee}
      <div>Assigned: {task.assignee}</div>
    {/if}

    {#if task.estimatedCompletion && task.status !== 'done'}
      <div class={isPastDue(task.estimatedCompletion) ? 'text-red-500 font-medium' : ''}>
        Due: {formatDate(task.estimatedCompletion)}
      </div>
    {/if}

    {#if task.completedAt && task.status === 'done'}
      <div>Completed: {formatDate(task.completedAt)}</div>
    {/if}
  </div>
</div>

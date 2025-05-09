<script lang="ts">
  import type { Task } from '$lib/types/task';
  import { formatDate, isPastDue } from '$lib/utils/dateFormat';
  
  export let task: Task;
</script>

<div class="bg-white border rounded-lg p-4 mb-2 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex justify-between items-start mb-2">
    <h3 class="font-medium text-gray-800">{task.title}</h3>
    <div class="text-xs text-gray-500">ID: {task.id}</div>
  </div>
  
  {#if task.description}
    <p class="text-sm text-gray-600 mb-2">{task.description}</p>
  {/if}
  
  <div class="flex flex-wrap gap-1 mb-2">
    {#if task.labels && task.labels.length}
      {#each task.labels as label}
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
<script lang="ts">
  import type { Task } from '$lib/types/task';
  import TaskCard from './TaskCard.svelte';

  export let id: 'todo' | 'doing' | 'done';
  export let title: string;
  export let tasks: Task[];
</script>

<div class="flex-1 bg-white rounded-lg shadow-md flex flex-col h-full min-w-[300px]">
  <div class="p-4 border-b bg-gray-50 rounded-t-lg">
    <h2 class="text-xl font-semibold text-gray-700">{title}</h2>
  </div>

  <div class="p-2 flex-1 overflow-y-auto" data-column-id={id}>
    {#each tasks as task (task.id)}
      <TaskCard {task} />
    {/each}
  </div>
</div>
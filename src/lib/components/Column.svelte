<script lang="ts">
  import type { Task } from '$lib/types/task';
  import TaskCard from './TaskCard.svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { createEventDispatcher } from 'svelte';
  import { taskStore } from '$lib/stores/taskStore';

  export let id: 'todo' | 'doing' | 'done';
  export let title: string;
  export let tasks: Task[];

  const dispatch = createEventDispatcher();

  // Transform tasks into items for dnd
  $: items = tasks.map(task => ({ id: task.id, task }));

  // Handle items being added to this column
  function handleDndConsiderItems(e: CustomEvent<{ items: any[] }>) {
    items = e.detail.items;
  }

  // Handle item being dropped into this column
  function handleDndFinalizeItems(e: CustomEvent<{ items: any[] }>) {
    items = e.detail.items;

    // Check for tasks that have been moved to this column
    items.forEach(item => {
      const task = item.task;
      if (task.status !== id) {
        // Update task status if it's been moved to a different column
        taskStore.updateTask(task.id, { status: id });
      }
    });
  }
</script>

<div class="flex-1 bg-white rounded-lg shadow-md flex flex-col h-full min-w-[300px]">
  <div class="p-4 border-b bg-gray-50 rounded-t-lg">
    <h2 class="text-xl font-semibold text-gray-700">{title}</h2>
  </div>

  <div
    class="p-2 flex-1 overflow-y-auto"
    data-column-id={id}
    use:dndzone={{ items, flipDurationMs: 300, type: 'tasks' }}
    on:consider={handleDndConsiderItems}
    on:finalize={handleDndFinalizeItems}
  >
    {#each items as item (item.id)}
      <TaskCard task={item.task} />
    {/each}
  </div>
</div>
<script lang="ts">
  import type { Task } from '$lib/types/task';
  import TaskCard from './TaskCard.svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { createEventDispatcher } from 'svelte';
  import { taskStore } from '$lib/stores/taskStore';

  export let id: 'todo' | 'doing' | 'done';
  export let title: string;
  export let tasks: Task[];

  const dispatch = createEventDispatcher<{
    'edit-task': Task;
    'add-task': { status: 'todo' | 'doing' | 'done' };
  }>();

  // Define the DND item type
  interface DndItem {
    id: string;
    task: Task;
  }

  // Transform tasks into items for dnd
  $: items = tasks.map(task => ({ id: task.id, task }));

  // Column task count
  $: taskCount = tasks.length;

  // Handle items being added to this column (during drag)
  function handleDndConsiderItems(e: CustomEvent<{ items: DndItem[] }>) {
    // This needs to update the UI during drag operation
    // We need to use a mutable local variable that won't be detected as a reactive reassignment
    const dndItems = e.detail.items;
    // @ts-ignore - Deliberate reassignment for DND library to work
    items = dndItems;
  }

  // Handle item being dropped into this column (after drop)
  function handleDndFinalizeItems(e: CustomEvent<{ items: DndItem[] }>) {
    // This finalizes the drag operation
    // We need to use a mutable local variable that won't be detected as a reactive reassignment
    const dndItems = e.detail.items;
    // @ts-ignore - Deliberate reassignment for DND library to work
    items = dndItems;

    // Process status changes for tasks moved to this column
    dndItems.forEach(item => {
      const task = item.task;
      if (task.status !== id) {
        // Update task status if it's been moved to a different column
        taskStore.updateTask(task.id, { status: id });
      }
    });
  }

  // Add a new task to this column
  function addTask() {
    dispatch('add-task', { status: id });
  }

  // Edit task handler
  function handleEditTask(task: Task) {
    dispatch('edit-task', task);
  }
</script>

<div class="flex-1 bg-white rounded-lg shadow-md flex flex-col h-full min-w-[300px]">
  <div class="p-4 border-b bg-gray-50 rounded-t-lg">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-gray-700">{title}</h2>
        <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-sm">
          {taskCount}
        </span>
      </div>
      <button
        on:click={addTask}
        class="text-gray-500 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
        title="Add task to {title}"
        aria-label="Add task to {title}"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  </div>

  <div
    class="p-2 flex-1 overflow-y-auto"
    data-column-id={id}
    use:dndzone={{ items, flipDurationMs: 300, type: 'tasks' }}
    on:consider={handleDndConsiderItems}
    on:finalize={handleDndFinalizeItems}
  >
    {#each items as item (item.id)}
      <TaskCard task={item.task} on:edit={() => handleEditTask(item.task)} />
    {/each}
  </div>
</div>

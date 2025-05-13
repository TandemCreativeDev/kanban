<script lang="ts">
  import type { Task, TaskStatus } from '$lib/types/task';
  import type { DndEvent, Item } from 'svelte-dnd-action';
  import TaskCard from './TaskCard.svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { taskStore } from '$lib/stores/taskStore';

  // Use props() rune instead of export let
  let { id, title, tasks, onEditTask, onAddTask } = $props<{
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onEditTask?: (task: Task) => void;
    onAddTask?: (status: TaskStatus) => void;
  }>();

  // Use $state for items so we can update them during drag operations
  let items = $state(tasks.map((task: Task) => ({ id: task.id, task })));

  // Column task count using $derived
  let taskCount = $derived(tasks.length);

  // Update items when tasks change
  $effect(() => {
    items = tasks.map((task: Task) => ({ id: task.id, task }));
  });

  // Handle items being added to this column (during drag)
  function handleDndConsiderItems(e: CustomEvent<DndEvent<Item>>) {
    // Update UI during drag operation
    items = e.detail.items;
  }

  // Handle item being dropped into this column (after drop)
  function handleDndFinalizeItems(e: CustomEvent<DndEvent<Item>>) {
    // This finalizes the drag operation
    items = e.detail.items;

    // Process status changes for tasks moved to this column
    items.forEach((item: Item) => {
      const task = item.task;
      if (task && task.status !== id) {
        // Update task status if it's been moved to a different column
        taskStore.updateTask(task.id, { status: id });
      }
    });
  }

  // Add a new task to this column
  function addTask() {
    if (onAddTask) onAddTask(id);
  }

  // Edit task handler
  function handleEditTask(task: Task) {
    if (onEditTask) onEditTask(task);
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
        onclick={addTask}
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
    onconsider={handleDndConsiderItems}
    onfinalize={handleDndFinalizeItems}
  >
    {#each items as item (item.id)}
      <TaskCard
        task={item.task}
        onEdit={handleEditTask}
        onDelete={() => {
          /* Task deletion handled by the TaskCard directly */
        }}
      />
    {/each}
  </div>
</div>

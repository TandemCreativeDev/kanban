<script lang="ts">
  import { onMount } from 'svelte';
  import { tasks, taskStore } from '$lib/stores/taskStore';
  import { sortTasks } from '$lib/utils/taskSort';
  import type { Task } from '$lib/types/task';
  import Column from './Column.svelte';
  import TaskModal from './TaskModal.svelte';

  // Using objects for quick access to column info
  const columns = [
    { id: 'todo' as const, title: 'To Do' },
    { id: 'doing' as const, title: 'Doing' },
    { id: 'done' as const, title: 'Done' }
  ];

  // Task sorting
  function getTasksForColumn(status: 'todo' | 'doing' | 'done'): Task[] {
    return sortTasks($tasks, status);
  }

  // Modal state
  let isModalOpen = false;
  let currentTask: Task | null = null;
  let initialStatus: 'todo' | 'doing' | 'done' = 'todo';

  // Open modal to create a new task
  function openCreateTaskModal() {
    currentTask = null;
    initialStatus = 'todo'; // Default to todo for general create task action
    isModalOpen = true;
  }

  // Open modal to edit a task
  function openEditTaskModal(task: Task) {
    currentTask = task;
    isModalOpen = true;
  }

  // Handle modal close
  function handleModalClose() {
    isModalOpen = false;
  }

  // Handle task save
  function handleTaskSave(event: CustomEvent<Task>) {
    const savedTask = event.detail;
    console.log('Task saved:', savedTask);
    // Additional logic if needed after save
  }

  // Load tasks on component mount
  onMount(async () => {
    await taskStore.loadTasks();
  });
</script>

<div class="h-full w-full p-6 bg-gray-100">
  <header class="mb-6 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Kanban Board</h1>
    <button
      on:click={openCreateTaskModal}
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Create Task
    </button>
  </header>

  <div class="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
    {#each columns as column (column.id)}
      <Column
        id={column.id}
        title={column.title}
        tasks={getTasksForColumn(column.id)}
        on:edit-task={e => openEditTaskModal(e.detail)}
        on:add-task={e => {
          currentTask = null;
          // Set the initial status based on which column triggered the add task
          initialStatus = e.detail.status;
          isModalOpen = true;
        }}
      />
    {/each}
  </div>

  <TaskModal
    isOpen={isModalOpen}
    task={currentTask}
    initialStatus={initialStatus}
    on:close={handleModalClose}
    on:save={handleTaskSave}
  />
</div>

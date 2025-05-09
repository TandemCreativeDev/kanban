<script lang="ts">
  import { onMount } from 'svelte';
  import { taskStore, todoTasks, doingTasks, doneTasks } from '$lib/stores/taskStore';
  import type { Task, TaskStatus } from '$lib/types/task';
  import Column from './Column.svelte';
  import TaskModal from './TaskModal.svelte';

  // Using $derived for reactive column data
  let columns = $derived([
    { id: 'todo' as const, title: 'To Do', tasks: $todoTasks },
    { id: 'doing' as const, title: 'Doing', tasks: $doingTasks },
    { id: 'done' as const, title: 'Done', tasks: $doneTasks }
  ]);

  // Modal state with $state for reactivity
  let isModalOpen = $state(false);
  let currentTask = $state<Task | null>(null);
  let initialStatus = $state<TaskStatus>('todo');

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

  // Handle column add task
  function handleAddTask(status: TaskStatus) {
    currentTask = null;
    initialStatus = status;
    isModalOpen = true;
  }

  // Load tasks on component mount
  onMount(async () => {
    try {
      const tasks = await taskStore.init();
      // Force a refresh of the reactive variables
      isModalOpen = false;
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  });
</script>

<div class="h-full w-full p-6 bg-gray-100">
  <header class="mb-6 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Kanban Board</h1>
    <button
      onclick={openCreateTaskModal}
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
        tasks={column.tasks}
        onEditTask={openEditTaskModal}
        onAddTask={handleAddTask}
      />
    {/each}
  </div>

  <TaskModal
    isOpen={isModalOpen === true}
    task={currentTask}
    {initialStatus}
    onClose={handleModalClose}
  />
</div>

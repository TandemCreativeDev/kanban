<script lang="ts">
  import { onMount } from 'svelte';
  import { tasks, taskStore } from '$lib/stores/taskStore';
  import { sortTasks } from '$lib/utils/taskSort';
  import type { Task } from '$lib/types/task';
  import Column from './Column.svelte';

  // Using objects for quick access to column info
  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' }
  ];

  // Task sorting
  function getTasksForColumn(status: 'todo' | 'doing' | 'done'): Task[] {
    return sortTasks($tasks, status);
  }

  // Load tasks on component mount
  onMount(async () => {
    await taskStore.loadTasks();
  });
</script>

<div class="h-full w-full p-6 bg-gray-100">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Kanban Board</h1>
  </header>

  <div class="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
    {#each columns as column}
      <Column
        id={column.id}
        title={column.title}
        tasks={getTasksForColumn(column.id as 'todo' | 'doing' | 'done')}
      />
    {/each}
  </div>
</div>

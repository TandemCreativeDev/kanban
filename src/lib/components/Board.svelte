<script lang="ts">
  import { onMount } from 'svelte';
  import { tasks, taskStore } from '$lib/stores/taskStore';
  import { sortTasks } from '$lib/utils/taskSort';
  import type { Task } from '$lib/types/task';
  
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

<div class="h-full w-full p-4 bg-gray-100">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Kanban Board</h1>
  </header>
  
  <div class="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
    {#each columns as column}
      <div class="flex-1 bg-white rounded-lg shadow-md flex flex-col h-full min-w-[300px]">
        <div class="p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 class="text-xl font-semibold text-gray-700">{column.title}</h2>
        </div>
        
        <div class="p-2 flex-1 overflow-y-auto">
          {#each getTasksForColumn(column.id as 'todo' | 'doing' | 'done') as task (task.id)}
            <div class="bg-white border rounded-lg p-4 mb-2 shadow-sm">
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
              
              <div class="flex justify-between text-xs text-gray-500">
                {#if task.assignee}
                  <div>Assigned: {task.assignee}</div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
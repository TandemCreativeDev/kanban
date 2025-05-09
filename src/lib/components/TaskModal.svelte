<script lang="ts">
  import type { Task, TaskStatus, NewTask } from '$lib/types/task';
  import { taskStore } from '$lib/stores/taskStore';

  // All props using $props() rune
  let { task, isOpen, initialStatus, onClose } = $props<{
    task: Task | null;
    isOpen: boolean;
    initialStatus: TaskStatus;
    onClose?: () => void;
  }>();

  // Whether we're editing an existing task or creating a new one
  let isEditing = $derived(!!task);
  let modalTitle = $derived(isEditing ? 'Edit Task' : 'Create New Task');

  // Task form data
  let formData = $state<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    labels: [],
    assignee: '',
    estimatedCompletion: undefined
  });

  // Label input handling
  let labelInput = $state('');

  // Form validation
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);

  // Initialize form when modal opens or task changes
  $effect(() => {
    if (isOpen) {
      if (isEditing && task) {
        formData = {
          title: task.title,
          description: task.description || '',
          status: task.status,
          labels: [...(task.labels || [])],
          assignee: task.assignee || '',
          estimatedCompletion: task.estimatedCompletion
        };
      } else {
        // Reset form for new task - use the initialStatus from props
        formData = {
          title: '',
          description: '',
          status: initialStatus,
          labels: [],
          assignee: '',
          estimatedCompletion: undefined
        };
      }
      // Clear errors
      errors = {};
      submitting = false;
    }
  });

  // Add a label
  function addLabel() {
    if (!labelInput.trim()) return;

    const newLabel = labelInput.trim();
    if (!formData.labels) {
      formData.labels = [];
    }

    if (!formData.labels.includes(newLabel)) {
      formData.labels = [...formData.labels, newLabel];
    }

    labelInput = '';
  }

  // Remove a label
  function removeLabel(label: string) {
    if (formData.labels) {
      formData.labels = formData.labels.filter(l => l !== label);
    }
  }

  // Handle date input change
  function handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      formData.estimatedCompletion = new Date(input.value);
    } else {
      formData.estimatedCompletion = undefined;
    }
  }

  // Validate form
  function validateForm(): boolean {
    errors = {};

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    return Object.keys(errors).length === 0;
  }

  // Handle form submission
  async function handleSubmit() {
    submitting = true;

    if (!validateForm()) {
      submitting = false;
      return;
    }

    try {
      let savedTask: Task;

      if (isEditing && task) {
        // Update existing task
        const updates: Partial<Task> = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          labels: formData.labels,
          assignee: formData.assignee,
          estimatedCompletion: formData.estimatedCompletion
        };

        savedTask = await taskStore.updateTask(task.id, updates);
      } else {
        // Create new task - ensure required fields are always defined
        const newTask: NewTask = {
          title: formData.title || '', // Required field
          description: formData.description || '',
          status: formData.status || 'todo', // Required field
          labels: formData.labels,
          assignee: formData.assignee,
          estimatedCompletion: formData.estimatedCompletion
        };

        savedTask = await taskStore.addTask(newTask);
      }
      close();
    } catch (error) {
      console.error('Error saving task:', error);
      errors.form = 'Failed to save task. Please try again.';
    } finally {
      submitting = false;
    }
  }

  // Close the modal
  function close() {
    if (onClose) onClose();
  }
</script>

{#if isOpen === true}
  <!-- Modal is open -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.key === 'Escape' && close()}
      role="dialog"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <h2 id="modal-title" class="text-xl font-semibold text-gray-800">{modalTitle}</h2>
        <button class="text-gray-500 hover:text-gray-700" onclick={close} aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form
        onsubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        class="px-6 py-4"
      >
        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 {errors.title
              ? 'border-red-500'
              : 'border-gray-300'}"
            placeholder="Task title"
          />
          {#if errors.title}
            <p class="mt-1 text-sm text-red-600">{errors.title}</p>
          {/if}
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            id="description"
            bind:value={formData.description}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task description"
          ></textarea>
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            id="status"
            bind:value={formData.status}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 {errors.status
              ? 'border-red-500'
              : ''}"
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
          {#if errors.status}
            <p class="mt-1 text-sm text-red-600">{errors.status}</p>
          {/if}
        </div>

        <!-- Assignee -->
        <div class="mb-4">
          <label for="assignee" class="block text-sm font-medium text-gray-700 mb-1">Assignee</label
          >
          <input
            type="text"
            id="assignee"
            bind:value={formData.assignee}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task assignee"
          />
        </div>

        <!-- Estimated Completion Date -->
        <div class="mb-4">
          <label for="estimatedCompletion" class="block text-sm font-medium text-gray-700 mb-1">
            Estimated Completion Date
          </label>
          <input
            type="date"
            id="estimatedCompletion"
            value={formData.estimatedCompletion instanceof Date
              ? formData.estimatedCompletion.toISOString().split('T')[0]
              : formData.estimatedCompletion
                ? new Date(formData.estimatedCompletion).toISOString().split('T')[0]
                : ''}
            onchange={handleDateChange}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Labels -->
        <div class="mb-4">
          <label for="labelInput" class="block text-sm font-medium text-gray-700 mb-1">Labels</label
          >

          <div class="flex">
            <input
              id="labelInput"
              type="text"
              bind:value={labelInput}
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a label"
              onkeydown={e => e.key === 'Enter' && (e.preventDefault(), addLabel())}
            />
            <button
              type="button"
              onclick={addLabel}
              class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          {#if formData.labels && formData.labels.length > 0}
            <div class="flex flex-wrap gap-2 mt-2">
              {#each formData.labels as label (label)}
                <div
                  class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {label}
                  <button
                    type="button"
                    class="ml-1 text-blue-500 hover:text-blue-700"
                    onclick={() => removeLabel(label)}
                    aria-label={`Remove ${label} label`}
                  >
                    &times;
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Form error -->
        {#if errors.form}
          <div class="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {errors.form}
          </div>
        {/if}

        <!-- Buttons -->
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onclick={close}
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={submitting}
          >
            {#if submitting}
              Saving...
            {:else}
              {isEditing ? 'Update' : 'Create'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<script lang="ts">
  // Props using $props() rune following Svelte 5 standards
  let { isOpen, title, message, confirmText, cancelText, onConfirm, onCancel } = $props<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>();

  // Set default values for optional props
  let actualConfirmText = $derived(confirmText || 'Confirm');
  let actualCancelText = $derived(cancelText || 'Cancel');

  // Close the dialog and trigger onCancel callback
  function close() {
    if (onCancel) onCancel();
  }

  // Handle confirm button click
  function handleConfirm() {
    if (onConfirm) onConfirm();
    close();
  }
</script>

{#if isOpen === true}
  <!-- Modal backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <!-- Modal dialog -->
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-md"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.key === 'Escape' && close()}
      role="dialog"
      aria-labelledby="confirm-dialog-title"
      tabindex="-1"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <h2 id="confirm-dialog-title" class="text-xl font-semibold text-gray-800">{title}</h2>
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

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-700">{message}</p>
      </div>

      <!-- Footer with action buttons -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t">
        <button
          type="button"
          onclick={close}
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {actualCancelText}
        </button>
        <button
          type="button"
          onclick={handleConfirm}
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {actualConfirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
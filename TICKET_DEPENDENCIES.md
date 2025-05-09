# Ticket Dependencies - Kanban Board Application

This document outlines the dependencies between Jack's frontend tickets and Max's backend tickets, helping to clarify which tasks can be completed independently and which require waiting for backend implementations.

## Backend Dependencies Status

Based on current implementation status:

| Max's Task | Status | Notes |
|------------|--------|-------|
| 1. Project Initialization | ✅ Complete | SvelteKit project with TypeScript and Tailwind is set up |
| 2. Project Structure Setup | ✅ Complete | Folder structure and Task interface are in place |
| 3. API Routes Development | ⚠️ Partial | `/api/tasks` GET/POST endpoints done, individual task endpoints missing |
| 4. Data Storage | ✅ Complete | `tasks.json` structure created with file operations |
| 5. Store Implementation | ✅ Complete | taskStore.ts implemented with CRUD operations |
| 6. Task Sorting Utilities | ✅ Complete | taskSort.ts and dateFormat.ts utilities implemented |
| 7. Server-side Validation | ⚠️ Partial | Basic validation exists, but might need enhancement |

## Frontend Tasks That Can Be Implemented Independently

These tasks can be completed using the existing dummy data without waiting for additional backend work:

1. **Column Component**
   - Refactor the column display from Board.svelte into a separate component
   - Implement drop targets for drag and drop using dummy functions

2. **Task Card Component**
   - Extract task card display into a separate component
   - Add drag source functionality using dummy functions

3. **Task Modal Component**
   - Create form for task creation/editing
   - Implement client-side validation
   - Connect to taskStore's dummy methods

4. **Confirmation Dialog**
   - Create reusable confirmation dialog
   - Implement confirmation logic
   - Style with Tailwind CSS

5. **Toast Notification System**
   - Create Toast component and notification store
   - Add success/error styling

6. **UI Styling & Animations**
   - Implement all Tailwind styling
   - Add transitions and animations

## Frontend Tasks That Depend on Backend Implementation

These tasks would benefit from waiting for Max to complete specific backend tickets:

1. **Full Drag and Drop Functionality**
   - **Depends on**: Individual task API endpoints (Max's ticket #3)
   - **Workaround**: Can be partially implemented with dummy functions first

2. **Task CRUD Operations via API**
   - **Depends on**: Individual task API endpoints (Max's ticket #3)
   - **Workaround**: Use taskStore's dummy methods temporarily

## Implementation Strategy

1. **Phase 1: Component Development**
   - Refactor and implement all UI components using dummy data
   - Implement basic interactivity with temporary functions

2. **Phase 2: API Integration**
   - Once Max completes the individual task endpoints, connect UI to real API
   - Replace dummy functions with real API calls

This approach allows for parallel development with minimal blocking, enabling the frontend work to progress while the backend is being completed.
# Project Tickets - Kanban Board Application

This document outlines the development tickets for the Kanban board application, divided between team members to minimize git conflicts.

## Max (Backend)

### 1. Project Initialization
- Create SvelteKit project with TypeScript configuration
- Install and configure Tailwind CSS and dependencies
- Set up ESLint and Prettier

### 2. Project Structure Setup
- Create folder structure according to architecture document
- Set up TypeScript interfaces for Task model
- Configure build process

### 3. API Routes Development
- Implement GET /api/tasks endpoint
- Implement POST /api/tasks endpoint
- Implement GET/PUT/DELETE /api/tasks/[id] endpoints

### 4. Data Storage
- Create tasks.json data structure
- Implement file read/write utilities
- Add error handling for file operations

### 5. Store Implementation
- Create taskStore.ts for state management
- Implement store methods for CRUD operations
- Add reactivity for UI updates

### 6. Task Sorting Utilities
- Create taskSort.ts utility
- Implement sorting algorithms by different criteria
- Create dateFormat.ts utility

### 7. Server-side Validation
- Implement validation for API inputs
- Add error handling for API routes
- Create validation utility functions

## Jack (Frontend)

### 1. Board Component
- Create Board.svelte component structure
- Implement layout with columns
- Connect to stores for data

### 2. Column Component
- Implement Column.svelte structure
- Add task list rendering in columns
- Add drop targets for drag and drop

### 3. Task Card Component
- Create TaskCard.svelte structure
- Implement task data display
- Add drag source functionality

### 4. Task Modal Component
- Create TaskModal.svelte
- Implement form for task creation/editing
- Add client-side validation

### 5. Confirmation Dialog
- Create ConfirmDialog.svelte
- Implement confirmation logic for deletions
- Style dialog with Tailwind

### 6. Toast Notification System
- Create Toast.svelte component
- Implement toast notification store
- Add success/error styling

### 7. UI Styling & Animations
- Implement Tailwind styling for all components
- Add transitions and animations
- Ensure responsive design

## Integration Checkpoints

To ensure smooth integration between frontend and backend components:

1. After ticket #2 completion (both developers): Review project structure and data model
2. After ticket #5 completion (both developers): Test store integration with components
3. Before final completion: Full end-to-end testing of all features
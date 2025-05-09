# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a Kanban board application built with SvelteKit. The application allows users to manage tasks across three columns: "To Do", "Doing", and "Done" with drag-and-drop functionality.

## Tech Stack

- **Frontend Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Drag-and-Drop**: svelte-dnd-action
- **Data Storage**: JSON files via SvelteKit API routes

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint

# Check TypeScript
npm run check
```

## Code Standards

### Import Standards

- Use 'node:' prefix for Node.js built-in modules (e.g., `import fs from 'node:fs'`)
- Import types with the `type` keyword (e.g., `import type { Task } from '$lib/types/task'`)
- Use the '$lib' alias for imports from the lib directory
- Sort imports in a consistent order: external libraries first, then internal modules
- Group imports by category with a blank line between groups
- Prefer named imports over default imports when multiple items are needed from a module

### General Guidelines

1. Use TypeScript for all new code
2. Follow the existing component structure and naming conventions
3. Keep components small and focused on a single responsibility
4. Use Svelte's built-in reactivity whenever possible
5. Extract reusable logic into utility functions
6. Use consistent error handling patterns throughout the application
7. Keep files organized in logical directories based on functionality
8. Comment complex logic but prefer self-documenting code through clear naming
9. Avoid duplicating code - create shared modules for common operations

### TypeScript

- Use proper typing for all variables, functions, and components
- Prefer interfaces over types for object definitions
- Export types and interfaces for reuse
- Use `undefined` instead of `null` for optional values to match TypeScript's strict null checking
- Always use explicit typing for complex objects, especially when creating new instances
- Use type assertions (`as Type`) only when TypeScript cannot infer types correctly
- Create utility types for common patterns (e.g., Omit<T, K>, Pick<T, K>)
- Handle type conversion carefully, especially with dates and serialized data
- Use Record<string, unknown> instead of any for objects with unknown structure
- Run TypeScript checks frequently to ensure type safety throughout development

```typescript
// Example
interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  // Other properties...
}
```

### Component Structure

- Use `.svelte` extension for all Svelte components
- Keep component files under 150 lines where possible
- Place reusable components in `src/lib/components`
- Use SvelteKit's built-in routing system for page components

```svelte
<!-- Example component structure -->
<script lang="ts">
  // Imports
  // Props
  // Variables and state
  // Methods
</script>

<!-- Template -->

<style>
  /* Component-specific styles (if any) */
</style>
```

### CSS/Styling

- Use Tailwind utility classes for styling
- Keep custom CSS to a minimum
- Use consistent spacing and sizing

### Error Handling

- Use toast notifications for user-facing errors
- Validate user input before submission
- Provide clear error messages

### API Routes

- Follow RESTful principles
- Return appropriate HTTP status codes
- Validate request data
- Import RequestHandler directly from '@sveltejs/kit' rather than local type files
- Use 'node:' prefix for Node.js built-in modules (e.g., 'node:fs', 'node:path')
- Handle JSON parsing exceptions with try/catch blocks
- Return consistent response formats for both success and error cases
- Create helper functions for common operations like error responses
- Centralize file path constants to avoid string duplication
- Use utility functions to handle serialization/deserialization of complex types (like Date objects)
- Apply the DRY (Don't Repeat Yourself) principle by extracting repeated logic into reusable functions
- Implement thorough validation before performing operations on data

### Git Workflow

- Use feature branches for all new work
- Keep commits small and focused
- Write descriptive commit messages
- Review code before merging

## Application Architecture

### Data Flow

1. Data is loaded from JSON files on initial page load
2. Updates are made through SvelteKit API routes
3. Svelte stores maintain the application state
4. Components react to state changes

### Code Organization

1. **Utility Pattern**:
   - Place reusable functions in dedicated utility files
   - Group related utilities by domain (e.g., date handling, task operations)
   - Keep utility functions pure when possible for easier testing

2. **File Structure**:
   - `/lib/types` - TypeScript interfaces and types
   - `/lib/utils` - Utility functions
   - `/lib/components` - Reusable UI components
   - `/lib/stores` - Svelte stores
   - `/routes/api` - API endpoints
   - `/routes` - Page components

3. **API Layer**:
   - Centralize file operations in utility functions
   - Use consistent error handling patterns
   - Convert between in-memory and serialized representations

### Component Hierarchy

- `Board.svelte`: Main container component
- `Column.svelte`: Individual column component
- `TaskCard.svelte`: Individual task card
- `TaskModal.svelte`: Form for creating/editing tasks
- `ConfirmDialog.svelte`: Confirmation for destructive actions
- `Toast.svelte`: Notification component

### Task Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  labels?: string[];
  assignee?: string;
  estimatedCompletion?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Key Features

- Drag-and-drop task movement between columns
- Automatic saving of changes
- Sorting by dates (estimated completion or completion date)
- Task creation and editing via modal
- Confirmation dialogs for destructive actions
- Toast notifications for feedback
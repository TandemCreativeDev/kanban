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

### General Guidelines

1. Use TypeScript for all new code
2. Follow the existing component structure and naming conventions
3. Keep components small and focused on a single responsibility
4. Use Svelte's built-in reactivity whenever possible

### TypeScript

- Use proper typing for all variables, functions, and components
- Prefer interfaces over types for object definitions
- Export types and interfaces for reuse

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
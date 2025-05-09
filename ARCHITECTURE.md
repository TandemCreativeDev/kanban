# Architectural Specification - Kanban Board Application

## Technology Stack

### Frontend

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Drag and Drop**: svelte-dnd-action
- **Language**: TypeScript

### Backend

- **API**: SvelteKit API routes
- **Data Storage**: JSON files
- **No external database required**

## Project Structure

```
kanban/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Board.svelte         # Main Kanban board component
│   │   │   ├── Column.svelte        # Individual column component
│   │   │   ├── TaskCard.svelte      # Task card component
│   │   │   ├── TaskModal.svelte     # Task creation/edit modal
│   │   │   ├── ConfirmDialog.svelte # Confirmation dialog for deletion
│   │   │   └── Toast.svelte         # Toast notification component
│   │   ├── stores/
│   │   │   └── taskStore.ts         # Svelte store for task data
│   │   ├── types/
│   │   │   └── task.ts              # TypeScript interfaces for task data
│   │   └── utils/
│   │       ├── taskSort.ts          # Utility for sorting tasks by date
│   │       ├── taskFileUtils.ts     # Helper functions for API routes
│   │       ├── dateFormat.ts        # Date formatting utilities
│   │       ├── taskApiService.ts    # API service for task operations
│   │       ├── taskTransform.ts     # Utilities for task transformations
│   │       └── storeFactory.ts      # Factory functions for creating stores
│   ├── routes/
│   │   ├── +page.svelte            # Main page with Kanban board
│   │   ├── +page.ts                # Data loading for main page
│   │   ├── +layout.svelte          # Layout wrapper
│   │   └── api/
│   │       ├── tasks/
│   │       │   ├── +server.ts       # GET (all tasks), POST (new task)
│   │       │   └── [id]/
│   │       │       └── +server.ts   # GET, PUT, DELETE for specific task
│   └── app.html                    # Base HTML template
├── static/
│   ├── data/
│   │   └── tasks.json              # JSON file for task storage
│   └── favicon.png
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── svelte.config.js                # SvelteKit configuration
├── .eslintrc.js                    # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── package.json                    # Project dependencies
└── README.md                       # Project documentation
```

## Data Model

### Task Interface

```typescript
interface Task {
  id: string; // Unique identifier
  title: string; // Task title (required)
  description?: string; // Optional description
  status: 'todo' | 'doing' | 'done'; // Current column
  labels?: string[]; // Optional array of labels
  assignee?: string; // Optional assignee name
  estimatedCompletion?: Date; // Estimated completion date
  completedAt?: Date; // When the task was marked as done
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### JSON Data Structure

```json
[
  {
    "id": "task-1",
    "title": "Example Task",
    "description": "This is an example task",
    "status": "todo",
    "labels": ["feature", "frontend"],
    "assignee": "John Doe",
    "estimatedCompletion": "2023-06-30T00:00:00.000Z",
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
  // More tasks...
]
```

## Utility Architecture

### API Service (taskApiService.ts)

- Centralizes all HTTP requests to API endpoints
- Provides methods for CRUD operations on tasks
- Handles API-specific error responses
- Abstracts the details of API interactions from the store

### Task Transformation (taskTransform.ts)

- Manages task object transformations
- Handles special logic for status transitions
- Ensures proper timestamp management (completion date, update date)
- Provides methods for creating and updating task objects

### Store Factory (storeFactory.ts)

- Creates and configures Svelte stores
- Provides factories for derived stores (filtered lists, counts)
- Ensures consistent store creation patterns
- Separates store creation logic from store usage

### Task Sorting (taskSort.ts)

- Implements sorting algorithms for different task statuses
- Provides consistent sorting for all task displays
- Handles the different sorting requirements per column

### Date Formatting (dateFormat.ts)

- Utility functions for formatting dates
- Provides consistent date display throughout the application
- Handles detection of past-due dates

### File Utilities (taskFileUtils.ts)

- Manages reading and writing tasks to JSON files
- Handles JSON serialization/deserialization
- Provides error handling for file operations
- Used by API routes for data persistence

## Component Architecture

### Board Component

- Contains the three columns
- Handles data loading and overall layout
- Manages modals and toast notifications

### Column Component

- Displays a list of tasks for a specific status
- Handles drag-and-drop targets
- Manages column-specific sorting

### TaskCard Component

- Displays individual task details
- Serves as drag source
- Provides controls for editing and deleting

### TaskModal Component

- Form for creating and editing tasks
- Validation logic
- Submit handling

### ConfirmDialog Component

- Simple confirmation dialog for destructive actions
- Customizable message and action buttons

### Toast Component

- Displays success and error notifications
- Auto-dismisses after timeout

## API Routes

### GET /api/tasks

- Returns all tasks as JSON array
- Sorted by default order

### POST /api/tasks

- Creates a new task
- Validates required fields
- Returns the created task with generated ID

### GET /api/tasks/[id]

- Returns a specific task by ID
- 404 if not found

### PUT /api/tasks/[id]

- Updates a specific task
- Handles status changes and updates timestamps
- Returns the updated task

### DELETE /api/tasks/[id]

- Deletes a specific task
- Returns success message

## State Management

- Separation of concerns with dedicated utility files
- Main store (taskStore.ts) coordinates state updates
- Derived stores for reactive UI updates (todoTasks, doingTasks, doneTasks)
- Additional stores for tracking loading and error states
- Counter stores for task statistics (todoCount, doingCount, doneCount)
- Optimistic UI updates with server synchronization
- Error recovery by reverting to previous state on API failures

## Error Handling

- Toast notifications for user-facing errors
- Console logging for development debugging
- Input validation to prevent bad data
- Dedicated error store for tracking error states
- Proper error recovery for optimistic UI updates

## Performance Considerations

- Minimizing re-renders using Svelte's reactivity
- Efficient sorting and filtering
- Local data storage for quick access and modifications
- Derived stores for pre-computed views
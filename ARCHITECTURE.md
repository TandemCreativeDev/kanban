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
│   │       └── dateFormat.ts        # Date formatting utilities
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
  id: string;              // Unique identifier
  title: string;           // Task title (required)
  description?: string;    // Optional description
  status: "todo" | "doing" | "done";  // Current column
  labels?: string[];       // Optional array of labels
  assignee?: string;       // Optional assignee name
  estimatedCompletion?: Date; // Estimated completion date
  completedAt?: Date;      // When the task was marked as done
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
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
  },
  // More tasks...
]
```

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
- Use SvelteKit's built-in stores for managing application state
- Task data loaded on initial page load
- Local updates for optimistic UI changes
- Server sync for persistence

## Error Handling
- Toast notifications for user-facing errors
- Console logging for development debugging
- Input validation to prevent bad data

## Performance Considerations
- Minimizing re-renders using Svelte's reactivity
- Efficient sorting and filtering
- Local data storage for quick access and modifications
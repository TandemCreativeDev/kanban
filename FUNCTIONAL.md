# Functional Specification - Kanban Board Application

## Overview
This document outlines the functional requirements for a collaborative Kanban board application. The application will allow users to manage tasks by adding, updating, and moving them between three columns: "To Do", "Doing", and "Done".

## Core Features

### 1. Board Layout
- Three fixed columns: "To Do", "Doing", and "Done"
- Responsive design optimized for tablet and desktop views (mobile as lower priority)
- Clean, intuitive interface using Tailwind CSS

### 2. Task Management

#### Task Creation
- Modal dialog for creating new tasks
- Form fields for task attributes:
  - Title (required)
  - Description
  - Labels
  - Assignees
  - Estimated completion date
  - Created at (auto-generated)
  - Updated at (auto-generated)
  - ID (auto-generated)
- Simple manual form validation
- Tasks saved automatically upon creation

#### Task Display
- Tasks displayed as cards within appropriate columns
- Cards show key information: title, description, labels, assignee, dates
- Sorting:
  - "To Do" and "Doing" columns: Sort by estimated completion date (closest dates first)
  - "Done" column: Sort by completed date (most recently completed first)

#### Task Movement
- Drag-and-drop functionality using svelte-dnd-action
- Tasks can be moved between any columns
- When moving to "Done" column, "completedAt" timestamp is automatically added
- Changes saved automatically when tasks are moved

#### Task Deletion
- Option to delete tasks
- Confirmation dialog before deletion

#### Task Update
- Ability to edit task details
- Automatic saving of changes

### 3. Data Persistence
- SvelteKit API routes with JSON file storage
- Flat array structure for task data
- Automatic saving of all changes
- No authentication required (local development only)

### 4. Error Handling
- Minimal error handling using toast notifications
- Validation for required fields

### 5. UI Enhancements
- Minimal animations for improved user experience
- Visual distinction between columns
- Clear visual hierarchy of information within task cards

## Non-Functional Requirements

### Performance
- Fast loading and response times
- Smooth interactions, especially for drag-and-drop operations

### Usability
- Intuitive interface requiring minimal training
- Clear visual feedback for user actions

### Reliability
- Consistent saving of data
- Minimal risk of data loss

### Development Constraints
- Local development only
- No deployment or authentication requirements
- Must be completable within a few hours workshop timeframe
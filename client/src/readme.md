
# Client Source Directory - React Application Code

This directory contains all the source code for the TaskFlow React application. It's organized following React best practices with clear separation of concerns and modular architecture.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui component library
├── hooks/              # Custom React hooks for shared logic  
├── lib/                # Utility libraries and configurations
├── pages/              # Page components for routing
├── App.tsx             # Root application component
├── main.tsx            # Application entry point and DOM mounting
└── index.css           # Global styles and Tailwind base
```

## Core Application Files

### `main.tsx` - Application Entry Point
**Purpose**: Bootstrap the React application and mount it to the DOM

**Key Features**:
- **React 18 createRoot**: Uses concurrent rendering features for better performance
- **Global CSS Import**: Loads Tailwind CSS and custom styles
- **DOM Mounting**: Connects React to the HTML root element
- **Error Handling**: Safe element selection with TypeScript non-null assertion

**Integration**:
- Called by Vite when the application starts
- References the `#root` element from `index.html`
- Imports and renders the main `App` component

### `App.tsx` - Root Component & Provider Setup
**Purpose**: Configure global application context and routing

**Provider Hierarchy**:
1. **QueryClientProvider**: React Query for server state management
2. **TooltipProvider**: Radix UI tooltip context for accessible tooltips
3. **Toaster**: Global toast notification system
4. **Router**: Client-side routing with Wouter

**Route Configuration**:
- **`/`**: Home page (main task interface)
- **`*`**: 404 fallback for unmatched routes

**Benefits**:
- Centralized provider configuration
- Consistent global context across all components
- Single source of truth for routing logic

### `index.css` - Global Styles & Design System
**Purpose**: Define global styles, CSS variables, and Tailwind configuration

**Key Sections**:
- **Tailwind Layers**: Base, components, and utilities
- **CSS Variables**: Theme colors, spacing, and component tokens
- **Global Resets**: Browser normalization and base element styles
- **Component Overrides**: shadcn/ui component customizations
- **Animations**: Custom keyframes and transition definitions

## Component Architecture

### `components/ui/` - Shared UI Components
**Source**: Generated and customized from shadcn/ui library

**Key Components**:
- **Form Components**: `form.tsx`, `input.tsx`, `button.tsx`, `checkbox.tsx`
- **Layout Components**: `card.tsx`, `separator.tsx`
- **Feedback Components**: `toast.tsx`, `toaster.tsx`
- **Interactive Components**: `tooltip.tsx`, `dialog.tsx`

**Benefits**:
- **Accessibility**: ARIA-compliant with keyboard navigation
- **Consistency**: Unified design system across the app
- **Customization**: Tailwind-based styling with CSS variables
- **Type Safety**: Full TypeScript integration

**Usage Pattern**:
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Components are pre-styled but accept custom classes
<Button className="custom-class" variant="destructive">
  Delete Task
</Button>
```

## Custom Hooks

### `hooks/use-task-mutations.ts` - Task Operations
**Purpose**: Encapsulate all task-related API operations with React Query

**Exported Functions**:
- **`createTask`**: Create new tasks with validation and optimistic updates
- **`updateTask`**: Toggle task completion status with proper timestamps  
- **`deleteTask`**: Permanently remove tasks with confirmation

**Features**:
- **Automatic Cache Management**: Invalidates queries after mutations
- **User Feedback**: Toast notifications for all operations
- **Error Handling**: Consistent error messaging across operations
- **Loading States**: Built-in pending states for UI feedback

**Usage**:
```typescript
const { createTask, updateTask, deleteTask } = useTaskMutations();

// Create a new task
createTask.mutate({ title: "New Task" });

// Toggle completion
updateTask.mutate({ id: 1, completed: true });
```

### `hooks/use-toast.ts` & `hooks/use-mobile.tsx`
**Purpose**: Utility hooks for common UI patterns

- **`use-toast`**: Imperative toast notification management
- **`use-mobile`**: Responsive design hook for mobile detection

## Page Components

### `pages/home.tsx` - Main Application Interface
**Purpose**: The primary task management interface combining all features

**Key Sections**:
1. **Header**: Application branding and description
2. **Statistics**: Task overview with counts and progress
3. **Add Task Form**: New task creation with validation
4. **Task Lists**: Organized display of pending and completed tasks
5. **Footer**: Simple branding and task count

**Features**:
- **Real-time Data**: React Query integration for live updates
- **Form Handling**: React Hook Form with Zod validation
- **Task Sorting**: Intelligent ordering (pending first, newest first)
- **Responsive Design**: Mobile-first with adaptive layouts
- **Loading States**: Skeleton loading and spinner indicators
- **Error Handling**: User-friendly error messages with retry options

**State Management**:
- **Server State**: Tasks fetched and cached with React Query
- **Form State**: Controlled by React Hook Form with validation
- **UI State**: Local component state for interactions

### `pages/not-found.tsx` - 404 Error Page
**Purpose**: Fallback route for unmatched URLs

**Features**:
- User-friendly error messaging
- Navigation back to home page
- Consistent design with main application

## Utility Libraries

### `lib/queryClient.ts` - React Query Configuration
**Purpose**: Configure React Query client with custom settings and API helpers

**Key Functions**:
- **`apiRequest`**: Centralized API calling with error handling
- **`getQueryFn`**: Default query function for GET requests
- **`queryClient`**: Pre-configured client with optimized defaults

**Configuration**:
- **Stale Time**: `Infinity` - data stays fresh until manually invalidated
- **Retry**: `false` - no automatic retries for failed requests
- **Refetch**: Disabled on window focus and intervals
- **Credentials**: Includes cookies for session management

### `lib/utils.ts` - Utility Functions
**Purpose**: Common helper functions used throughout the application

**Exports**:
- **`cn`**: Class name utility combining `clsx` and `tailwind-merge`
- Additional utility functions as needed

## Development Patterns

### Import Aliases
All source files use the `@/` alias for clean imports:
```typescript
import { Button } from "@/components/ui/button";
import { useTaskMutations } from "@/hooks/use-task-mutations";
import { apiRequest } from "@/lib/queryClient";
```

### Type Safety
- **Shared Types**: Import types from `@shared/schema` for consistency
- **Strict TypeScript**: All files use strict type checking
- **Component Props**: Proper TypeScript interfaces for all components

### Error Boundaries
- **Global Error Handling**: App-level error boundaries for unexpected errors
- **API Error Handling**: Structured error responses with user-friendly messages
- **Form Validation**: Field-level and form-level error display

### Performance Optimization
- **React Query Caching**: Automatic caching reduces API calls
- **Form Optimization**: React Hook Form minimizes re-renders
- **Component Memoization**: Strategic use of React.memo where beneficial
- **Bundle Splitting**: Vite automatically splits code for optimal loading

## Integration Points

### Backend Communication
- **API Layer**: Centralized in `lib/queryClient.ts`
- **Shared Schemas**: Validation and types from `/shared/schema.ts`
- **Error Handling**: Consistent error format between client and server

### Build System
- **Vite Configuration**: Fast development and optimized production builds
- **TypeScript**: Compile-time type checking with path mapping
- **Tailwind CSS**: Utility-first styling with component integration

This source directory demonstrates modern React application architecture with emphasis on type safety, performance, and maintainable code organization.


# Hooks Directory - Custom React Hooks

This directory contains custom React hooks that encapsulate reusable logic and provide clean abstractions for common patterns throughout the TaskFlow application. These hooks follow React best practices and promote code reusability while maintaining type safety.

## Overview

Custom hooks in this application serve several key purposes:
- **Encapsulate Complex Logic**: Abstract away implementation details from components
- **Promote Reusability**: Share common functionality across multiple components
- **Maintain Separation of Concerns**: Keep business logic separate from UI components
- **Provide Type Safety**: Leverage TypeScript for compile-time error checking
- **Manage Side Effects**: Handle API calls, subscriptions, and other side effects

## Hook Inventory

### `use-task-mutations.ts` - Task Operations Hook
**Purpose**: Centralized task management operations with React Query integration

**Exported Functions**:
- **`createTask`**: Mutation for creating new tasks with validation
- **`updateTask`**: Mutation for toggling task completion status  
- **`deleteTask`**: Mutation for permanently removing tasks

**Key Features**:
- **Automatic Cache Management**: Invalidates React Query cache after mutations
- **User Feedback**: Integrated toast notifications for all operations
- **Error Handling**: Consistent error messaging and recovery
- **Loading States**: Built-in pending states for UI feedback
- **Optimistic Updates**: Immediate UI response before server confirmation

**Usage Example**:
```typescript
const { createTask, updateTask, deleteTask } = useTaskMutations();

// Create a new task
createTask.mutate({ title: "Complete documentation" });

// Toggle task completion
updateTask.mutate({ id: 1, completed: true });

// Delete a task
deleteTask.mutate(taskId);
```

**Benefits**:
- Components don't need to handle API call complexity
- Consistent behavior across all task operations
- Centralized error handling and user feedback
- Type-safe mutations with shared schemas

### `use-toast.ts` - Toast Notification System
**Purpose**: Imperative toast notification management with queue handling

**Core Functionality**:
- **Toast Display**: Show success, error, and info messages
- **Queue Management**: Handle multiple simultaneous notifications
- **Auto-dismiss**: Automatic removal after timeout
- **Manual Control**: Programmatic dismiss and update capabilities

**Key Components**:
- **`useToast()`**: Hook for accessing toast functionality
- **`toast()`**: Imperative function for creating notifications
- **State Management**: Reducer-based state with memory persistence
- **Listener System**: Subscribe to toast state changes

**Usage Example**:
```typescript
const { toast } = useToast();

// Success notification
toast({
  title: "Success",
  description: "Task completed successfully!",
});

// Error notification
toast({
  title: "Error",
  description: "Failed to save changes.",
  variant: "destructive",
});
```

**Advanced Features**:
- **Custom Actions**: Add buttons to toast notifications
- **Persistent Toasts**: Disable auto-dismiss for important messages
- **Update Capability**: Modify existing toasts after creation
- **Multiple Variants**: Success, error, warning, and info styles

### `use-mobile.tsx` - Responsive Design Hook
**Purpose**: Detect mobile viewport for responsive UI behavior

**Functionality**:
- **Breakpoint Detection**: Monitors screen width against mobile threshold (768px)
- **Real-time Updates**: Responds to window resize events
- **SSR Safe**: Handles server-side rendering without hydration mismatches
- **Performance Optimized**: Uses native `matchMedia` API for efficiency

**Usage Example**:
```typescript
const isMobile = useIsMobile();

return (
  <div>
    {isMobile ? (
      <MobileTaskList tasks={tasks} />
    ) : (
      <DesktopTaskList tasks={tasks} />
    )}
  </div>
);
```

**Implementation Details**:
- **Initial State**: Starts with `undefined` to prevent hydration issues
- **Event Listeners**: Automatically manages resize event subscriptions
- **Cleanup**: Properly removes event listeners on unmount
- **Boolean Coercion**: Returns definitive boolean value for conditional rendering

## Design Patterns

### Custom Hook Conventions
All hooks in this directory follow consistent patterns:

#### Naming Convention
```typescript
// ✅ Good: Descriptive hook names with 'use' prefix
use-task-mutations.ts
use-mobile.tsx  
use-toast.ts

// ❌ Avoid: Generic or unclear names
use-api.ts
use-utils.ts
use-helpers.ts
```

#### Return Value Patterns
```typescript
// ✅ Single purpose hooks return direct values
const isMobile = useIsMobile(); // boolean

// ✅ Multi-purpose hooks return objects
const { createTask, updateTask, deleteTask } = useTaskMutations();

// ✅ Utility hooks return both state and actions
const { toast, dismiss } = useToast();
```

#### Error Handling
```typescript
// ✅ Good: Centralized error handling within hooks
const createTask = useMutation({
  mutationFn: apiCall,
  onError: () => {
    toast({ title: "Error", variant: "destructive" });
  },
});

// ❌ Avoid: Exposing error handling to components
const { mutate, error } = useMutation(apiCall);
// Component must handle error state
```

### Integration with React Query
Several hooks integrate with React Query for server state management:

#### Cache Management
```typescript
// Automatic cache invalidation after mutations
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
}
```

#### Optimistic Updates
```typescript
// Future enhancement: Optimistic updates for better UX
onMutate: async (newTask) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ["/api/tasks"] });
  
  // Snapshot previous value
  const previousTasks = queryClient.getQueryData(["/api/tasks"]);
  
  // Optimistically update cache
  queryClient.setQueryData(["/api/tasks"], (old) => [...old, newTask]);
  
  return { previousTasks };
}
```

## Testing Considerations

### Hook Testing Strategy
Custom hooks should be tested in isolation using React Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import { useTaskMutations } from './use-task-mutations';

test('should create task and invalidate cache', async () => {
  const { result } = renderHook(() => useTaskMutations());
  
  await act(async () => {
    result.current.createTask.mutate({ title: 'Test task' });
  });
  
  expect(result.current.createTask.isSuccess).toBe(true);
});
```

### Mock Dependencies
```typescript
// Mock React Query for isolated testing
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));
```

## Future Enhancements

### Potential New Hooks

#### `use-task-filters.ts`
```typescript
// Advanced filtering and search functionality
const { 
  filters, 
  setFilter, 
  clearFilters, 
  filteredTasks 
} = useTaskFilters(tasks);
```

#### `use-offline.ts`
```typescript
// Offline capability detection and queue management
const { 
  isOnline, 
  queuedActions, 
  syncPending 
} = useOffline();
```

#### `use-keyboard-shortcuts.ts`
```typescript
// Global keyboard shortcut handling
const { 
  registerShortcut, 
  unregisterShortcut 
} = useKeyboardShortcuts();
```

#### `use-local-storage.ts`
```typescript
// Persistent local storage with React state sync
const [settings, setSettings] = useLocalStorage('user-settings', defaultSettings);
```

### Performance Optimizations

#### Debounced Operations
```typescript
// Future: Debounced search and filtering
const debouncedSearch = useDebounce(searchTerm, 300);
```

#### Virtualization Support
```typescript
// Future: Virtual scrolling for large task lists
const { virtualItems, totalSize } = useVirtualizer({
  count: tasks.length,
  getScrollElement: () => parentRef.current,
});
```

## Best Practices

### Hook Composition
```typescript
// ✅ Good: Compose multiple hooks for complex functionality
function useTaskManagement() {
  const { createTask, updateTask, deleteTask } = useTaskMutations();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleTaskComplete = (id: number) => {
    updateTask.mutate({ id, completed: true });
    if (!isMobile) {
      toast({ title: "Task completed!" });
    }
  };
  
  return { handleTaskComplete };
}
```

### Dependency Management
```typescript
// ✅ Good: Minimal external dependencies
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// ❌ Avoid: Heavy external dependencies in hooks
import { entire-ui-library } from "heavy-library";
```

### Type Safety
```typescript
// ✅ Good: Proper TypeScript typing
interface UseTaskMutationsReturn {
  createTask: UseMutationResult<Task, Error, InsertTask>;
  updateTask: UseMutationResult<Task, Error, UpdateTaskParams>;
  deleteTask: UseMutationResult<void, Error, number>;
}

export function useTaskMutations(): UseTaskMutationsReturn {
  // Implementation
}
```

This hooks directory provides a solid foundation for reusable logic across the TaskFlow application, promoting clean architecture and maintainable code while ensuring type safety and optimal user experience.

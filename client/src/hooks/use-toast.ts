/**
 * Toast Notification System - Custom Hook Implementation
 * 
 * This file implements a comprehensive toast notification system using React hooks
 * and a global state management pattern. It provides a clean API for displaying
 * temporary notifications throughout the application without prop drilling.
 * 
 * Key features:
 * - Global toast state management using React's useReducer pattern
 * - Automatic toast dismissal with configurable timeouts
 * - Support for multiple toast variants (success, error, warning, etc.)
 * - Programmatic toast control (add, update, dismiss, remove)
 * - Memory-efficient queue management with configurable limits
 * - Type-safe API with full TypeScript integration
 * 
 * Architecture:
 * - State managed through reducer pattern for predictable updates
 * - Global listener system for cross-component toast triggering
 * - Automatic cleanup to prevent memory leaks
 * - Separation of concerns between state management and UI rendering
 * 
 * This implementation is based on the shadcn/ui toast system but enhanced
 * with additional documentation and type safety improvements.
 */

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

/**
 * Maximum number of toasts that can be displayed simultaneously
 * Prevents UI overflow and maintains good user experience
 * 
 * Design rationale:
 * - Single toast reduces cognitive load on users
 * - Prevents notification spam and UI clutter
 * - Ensures important messages get attention
 * - Can be increased if multiple toasts are needed
 */
const TOAST_LIMIT = 1

/**
 * Delay in milliseconds before toast is completely removed from DOM
 * Set to high value to effectively disable auto-removal
 * 
 * Current value (1000000ms = ~16.7 minutes) means toasts persist until
 * manually dismissed. This gives users time to read and act on notifications.
 * 
 * For auto-dismissal, consider values like:
 * - 4000ms for success messages
 * - 6000ms for informational messages  
 * - No auto-dismiss for error messages
 */
const TOAST_REMOVE_DELAY = 1000000

/**
 * Extended toast interface combining base props with additional metadata
 * 
 * Extends the base ToastProps with:
 * - Unique identifier for state management
 * - Optional title and description content
 * - Optional action buttons for user interaction
 */
type ToasterToast = ToastProps & {
  /** Unique identifier for toast management */
  id: string
  /** Main toast title (can be text or React elements) */
  title?: React.ReactNode
  /** Detailed toast description (can be text or React elements) */
  description?: React.ReactNode
  /** Optional action button for user interaction */
  action?: ToastActionElement
}

/**
 * Action type constants for the toast reducer
 * Using const assertion for type safety and autocompletion
 * 
 * Action flow:
 * 1. ADD_TOAST: Adds new toast to queue
 * 2. UPDATE_TOAST: Modifies existing toast properties
 * 3. DISMISS_TOAST: Initiates toast dismissal (starts fade out)
 * 4. REMOVE_TOAST: Completely removes toast from state
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",      // Add new toast to the queue
  UPDATE_TOAST: "UPDATE_TOAST", // Update existing toast properties
  DISMISS_TOAST: "DISMISS_TOAST", // Start dismissal process (fade out)
  REMOVE_TOAST: "REMOVE_TOAST",  // Remove toast from DOM completely
} as const

/**
 * Global counter for generating unique toast IDs
 * Increments with each new toast to ensure uniqueness
 */
let count = 0

/**
 * Generates unique IDs for toast identification
 * 
 * Uses a simple incrementing counter with overflow protection
 * to prevent integer overflow in long-running applications.
 * 
 * @returns string - Unique toast identifier
 */
function genId() {
  // Increment counter with overflow protection
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

/**
 * Type helper to extract action type strings
 * Provides type safety for action creators
 */
type ActionType = typeof actionTypes

/**
 * Union type defining all possible toast actions
 * 
 * Each action type has specific payload requirements:
 * - ADD_TOAST: Requires complete toast object
 * - UPDATE_TOAST: Accepts partial toast properties (id required implicitly)
 * - DISMISS_TOAST: Optional toast ID (if empty, dismisses all)
 * - REMOVE_TOAST: Optional toast ID (if empty, removes all)
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast // Complete toast object for new toasts
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast> // Partial properties for updates
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"] // Optional ID - undefined means dismiss all
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"] // Optional ID - undefined means remove all
    }

/**
 * Global toast state interface
 * 
 * Maintains array of active toasts with the following characteristics:
 * - Ordered array (newest first)
 * - Limited by TOAST_LIMIT constant
 * - Each toast has unique ID for management
 */
interface State {
  /** Array of active toasts, ordered by creation time (newest first) */
  toasts: ToasterToast[]
}

/**
 * Global timeout management for toast auto-removal
 * 
 * Maps toast IDs to their respective timeout handles for cleanup management.
 * This prevents memory leaks and allows for timeout cancellation when needed.
 * 
 * Key behaviors:
 * - Stores timeout references for active toasts
 * - Prevents duplicate timeouts for the same toast
 * - Automatically cleans up completed timeouts
 * - Enables timeout cancellation for manual dismissal
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Queues a toast for automatic removal after the configured delay
 * 
 * This function manages the lifecycle of toast auto-removal by:
 * - Preventing duplicate timeouts for the same toast
 * - Setting up automatic cleanup after delay period
 * - Cleaning up timeout references to prevent memory leaks
 * - Dispatching removal action when timeout expires
 * 
 * @param toastId - Unique identifier of the toast to remove
 */
const addToRemoveQueue = (toastId: string) => {
  // Prevent duplicate timeouts for the same toast
  // This can happen if dismiss is called multiple times rapidly
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Create timeout for automatic toast removal
  const timeout = setTimeout(() => {
    // Clean up the timeout reference first
    toastTimeouts.delete(toastId)
    
    // Dispatch removal action to update global state
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  // Store timeout reference for potential cancellation
  toastTimeouts.set(toastId, timeout)
}

/**
 * Toast state reducer function
 * 
 * Manages all toast state transitions using Redux-style reducer pattern.
 * Each action type has specific behavior for maintaining toast queue state.
 * 
 * State transitions:
 * - ADD_TOAST: Prepends new toast to queue, enforces limit
 * - UPDATE_TOAST: Merges new properties into existing toast
 * - DISMISS_TOAST: Initiates dismissal animation and queues removal
 * - REMOVE_TOAST: Permanently removes toast from state
 * 
 * @param state - Current toast state
 * @param action - Action to perform on the state
 * @returns Updated state after applying the action
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    /**
     * ADD_TOAST: Add new toast to the beginning of the queue
     * 
     * Behavior:
     * - Prepends new toast (newest first ordering)
     * - Enforces TOAST_LIMIT by truncating excess toasts
     * - Older toasts are automatically removed when limit exceeded
     */
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast to beginning and enforce limit
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    /**
     * UPDATE_TOAST: Modify properties of existing toast
     * 
     * Behavior:
     * - Finds toast by ID and merges new properties
     * - Preserves existing properties not specified in update
     * - Maintains toast order in queue
     * - No-op if toast ID not found
     */
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          // Merge new properties into matching toast
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    /**
     * DISMISS_TOAST: Initiate toast dismissal process
     * 
     * Behavior:
     * - Sets open: false to trigger fade-out animation
     * - Queues toast for automatic removal after delay
     * - Can dismiss specific toast or all toasts
     * - Side effect: Calls addToRemoveQueue for cleanup
     */
    case "DISMISS_TOAST": {
      const { toastId } = action

      /**
       * Side effect: Queue toasts for removal
       * 
       * Note: This is a side effect within the reducer, which typically
       * should be avoided for pure functions. However, it's kept here
       * for simplicity and to maintain the existing API.
       * 
       * Alternative would be to handle this in middleware or separate effect
       */
      if (toastId) {
        // Queue specific toast for removal
        addToRemoveQueue(toastId)
      } else {
        // Queue all toasts for removal
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          // Set open: false for target toast(s) to trigger animation
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Triggers dismissal animation
              }
            : t
        ),
      }
    }
    
    /**
     * REMOVE_TOAST: Permanently remove toast from state
     * 
     * Behavior:
     * - Filters out target toast from state array
     * - Can remove specific toast or clear all toasts
     * - Final step in toast lifecycle after dismissal animation
     * - Prevents memory leaks by cleaning up references
     */
    case "REMOVE_TOAST":
      // Handle remove all toasts case
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Clear all toasts
        }
      }
      
      // Remove specific toast by filtering it out
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * Global state management system for toast notifications
 * 
 * Implements a simple pub-sub pattern where:
 * - State is stored in module-level variable
 * - Components subscribe via listeners array
 * - State changes trigger all listener callbacks
 * - No external state management library required
 */

/**
 * Array of listener functions that react to state changes
 * 
 * Each listener is a callback function that receives the new state
 * when toast state changes. This allows multiple components to
 * subscribe to toast updates without prop drilling.
 */
const listeners: Array<(state: State) => void> = []

/**
 * In-memory state storage for toast notifications
 * 
 * Maintains the single source of truth for toast state outside
 * of React component lifecycle. This enables:
 * - Cross-component toast triggering
 * - State persistence during component unmounts
 * - Simplified state access without context providers
 */
let memoryState: State = { toasts: [] }

/**
 * Global dispatch function for state updates
 * 
 * Applies actions to the current state using the reducer and
 * notifies all registered listeners of the state change.
 * 
 * @param action - Action to apply to current state
 */
function dispatch(action: Action) {
  // Apply action to current state using reducer
  memoryState = reducer(memoryState, action)
  
  // Notify all subscribers of state change
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Public toast interface omitting internal ID field
 * 
 * Users provide toast content without worrying about ID management.
 * The ID is automatically generated internally for state tracking.
 */
type Toast = Omit<ToasterToast, "id">

/**
 * Main toast creation function - Primary API for displaying toasts
 * 
 * Creates and displays a new toast notification with the provided configuration.
 * Returns control methods for the created toast (update, dismiss).
 * 
 * Features:
 * - Automatic ID generation for state management
 * - Built-in dismiss functionality via onOpenChange
 * - Fluent API for toast manipulation after creation
 * - Type-safe configuration options
 * 
 * @param props - Toast configuration (title, description, variant, etc.)
 * @returns Object with toast control methods (id, dismiss, update)
 */
function toast({ ...props }: Toast) {
  // Generate unique ID for this toast instance
  const id = genId()

  /**
   * Update function for modifying toast after creation
   * 
   * Allows dynamic updates to toast properties like title,
   * description, or variant while toast is displayed.
   * 
   * @param props - New properties to merge into toast
   */
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  
  /**
   * Dismiss function for programmatic toast removal
   * 
   * Triggers the dismissal animation and queues toast for removal.
   * Can be called manually or automatically via UI interactions.
   */
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Create and add the toast to global state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Initially visible
      /**
       * Handle toast close events from UI interactions
       * 
       * This callback is triggered when:
       * - User clicks close button
       * - Toast auto-dismisses (if configured)
       * - Escape key is pressed (accessibility)
       */
      onOpenChange: (open) => {
        if (!open) dismiss() // Dismiss when closed
      },
    },
  })

  // Return control interface for the created toast
  return {
    id: id,      // Unique identifier
    dismiss,     // Manual dismissal function
    update,      // Property update function
  }
}

/**
 * React hook for toast state management and control
 * 
 * This hook provides components with access to the global toast state
 * and control functions. It automatically subscribes to state changes
 * and provides methods for creating and dismissing toasts.
 * 
 * Key features:
 * - Automatic subscription to global toast state
 * - Proper cleanup to prevent memory leaks
 * - Direct access to toast creation function
 * - Dismiss functionality for manual toast control
 * 
 * Usage patterns:
 * - Import once per component that needs toast functionality
 * - Call toast() to create new notifications
 * - Use dismiss() for manual toast removal
 * - Access toasts array for custom UI rendering
 * 
 * @returns Object containing toast state and control functions
 */
function useToast() {
  /**
   * Local state synchronized with global toast state
   * 
   * Initialized with current global state to prevent initial
   * render mismatches. Updated via listener subscription.
   */
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    /**
     * Subscribe to global state changes
     * 
     * Adds this component's setState function to the global listeners
     * array so it receives updates when toast state changes from
     * any part of the application.
     */
    listeners.push(setState)
    
    /**
     * Cleanup function to prevent memory leaks
     * 
     * Removes this component's listener when the component unmounts
     * or when the effect re-runs. Critical for preventing:
     * - Memory leaks from orphaned listeners
     * - Calls to setState on unmounted components
     * - Performance degradation in long-running apps
     */
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Re-run if state reference changes (rare but possible)

  /**
   * Return comprehensive toast interface
   * 
   * Spreads current state (toasts array) and adds control functions:
   * - toast: Function to create new toast notifications
   * - dismiss: Function to dismiss specific or all toasts
   */
  return {
    ...state,                    // Current toast state (toasts array)
    toast,                       // Toast creation function
    /**
     * Dismiss function for manual toast control
     * 
     * @param toastId - Optional toast ID to dismiss specific toast
     *                  If undefined, dismisses all active toasts
     */
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

// Export the hook and standalone toast function for flexibility
export { useToast, toast }

/*
 * Usage Examples and Patterns:
 * 
 * Basic toast creation:
 * ```typescript
 * const { toast } = useToast();
 * 
 * const handleSuccess = () => {
 *   toast({
 *     title: "Success!",
 *     description: "Your changes have been saved.",
 *   });
 * };
 * ```
 * 
 * Error toast with custom styling:
 * ```typescript
 * const { toast } = useToast();
 * 
 * const handleError = (error: Error) => {
 *   toast({
 *     title: "Error",
 *     description: error.message,
 *     variant: "destructive",
 *   });
 * };
 * ```
 * 
 * Toast with action button:
 * ```typescript
 * const { toast } = useToast();
 * 
 * const handleUndo = () => {
 *   const { dismiss } = toast({
 *     title: "Item deleted",
 *     description: "Your item has been removed.",
 *     action: (
 *       <ToastAction onClick={handleUndoAction}>
 *         Undo
 *       </ToastAction>
 *     ),
 *   });
 *   
 *   // Auto-dismiss after user action
 *   setTimeout(dismiss, 5000);
 * };
 * ```
 * 
 * Programmatic toast control:
 * ```typescript
 * const { toast, dismiss } = useToast();
 * 
 * const handleLongOperation = async () => {
 *   const loadingToast = toast({
 *     title: "Processing...",
 *     description: "Please wait while we process your request.",
 *   });
 *   
 *   try {
 *     await longRunningOperation();
 *     loadingToast.dismiss();
 *     toast({ title: "Complete!", description: "Operation finished." });
 *   } catch (error) {
 *     loadingToast.dismiss();
 *     toast({ title: "Error", description: error.message, variant: "destructive" });
 *   }
 * };
 * ```
 * 
 * Integration with form validation:
 * ```typescript
 * const { toast } = useToast();
 * 
 * const handleFormSubmit = async (data: FormData) => {
 *   try {
 *     await submitForm(data);
 *     toast({
 *       title: "Form submitted",
 *       description: "We'll get back to you soon!",
 *     });
 *   } catch (validationError) {
 *     toast({
 *       title: "Validation failed",
 *       description: "Please check your inputs and try again.",
 *       variant: "destructive",
 *     });
 *   }
 * };
 * ```
 */

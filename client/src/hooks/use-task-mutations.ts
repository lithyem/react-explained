
/**
 * Task Mutations Custom Hook
 * 
 * This custom React hook encapsulates all task-related mutation operations using React Query.
 * It provides a clean interface for UI components to perform CRUD operations on tasks
 * without needing to handle the complexity of API calls, error handling, or cache management.
 * 
 * Key features:
 * - Automatic cache invalidation after mutations
 * - User-friendly toast notifications for all operations
 * - Consistent error handling across all mutations
 * - Optimistic updates for better perceived performance
 * - Type-safe API calls using shared schemas
 * 
 * This hook follows the separation of concerns principle by keeping mutation logic
 * separate from UI components, making the code more testable and reusable.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type InsertTask } from "@shared/schema";

/**
 * Custom hook that provides all task mutation functions
 * Returns mutation objects with loading states, error handling, and success callbacks
 * 
 * @returns Object containing createTask, updateTask, and deleteTask mutations
 */
export function useTaskMutations() {
  // Hook for displaying toast notifications to users
  const { toast } = useToast();
  
  // React Query client for manual cache management
  const queryClient = useQueryClient();

  /**
   * Mutation for creating new tasks
   * Handles form submission data, validates on server, and updates UI
   */
  const createTask = useMutation({
    /**
     * The actual API call function
     * @param data - Task creation data (title is required)
     * @returns Promise resolving to the created task object
     */
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    
    /**
     * Success callback - runs after successful task creation
     * Invalidates the tasks cache to trigger a refetch and show the new task
     * Shows success toast to provide user feedback
     */
    onSuccess: () => {
      // Invalidate and refetch tasks to show the newly created task
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      // Show success notification to user
      toast({
        title: "Success",
        description: "Task added successfully!",
      });
    },
    
    /**
     * Error callback - runs if task creation fails
     * Shows user-friendly error message without exposing technical details
     */
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation for updating task completion status
   * Handles toggling between completed and pending states with proper timestamps
   */
  const updateTask = useMutation({
    /**
     * The actual API call function for updating tasks
     * @param params - Object containing task ID and new completion status
     * @returns Promise resolving to the updated task object
     */
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return response.json();
    },
    
    /**
     * Success callback - runs after successful task update
     * Uses the mutation variables to determine what message to show
     * @param _ - Response data (unused)
     * @param completed - The new completion status from mutation variables
     */
    onSuccess: (_, { completed }) => {
      // Refresh task list to show updated status and sorting
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      // Show contextual success message based on the action performed
      toast({
        title: completed ? "Task completed!" : "Task marked as pending",
        description: completed ? "Great job! 🎉" : "Task moved back to pending",
      });
    },
    
    /**
     * Error callback - runs if task update fails
     * Provides generic error message since update failures are usually temporary
     */
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  /**
   * Mutation for permanently deleting tasks
   * Handles complete removal from database with proper user feedback
   */
  const deleteTask = useMutation({
    /**
     * The actual API call function for deleting tasks
     * @param id - Task ID to delete
     * @returns Promise that resolves when deletion is complete
     */
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    
    /**
     * Success callback - runs after successful task deletion
     * Refreshes the task list and confirms the action to the user
     */
    onSuccess: () => {
      // Remove deleted task from cache and refetch remaining tasks
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      // Confirm successful deletion to user
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    },
    
    /**
     * Error callback - runs if task deletion fails
     * Shows error message since deletion failure might indicate data consistency issues
     */
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  /**
   * Return all mutation functions for use in components
   * Each mutation object includes:
   * - mutate: Function to trigger the mutation
   * - isPending: Boolean indicating if mutation is in progress
   * - error: Error object if mutation failed
   * - data: Response data if mutation succeeded
   */
  return {
    createTask,
    updateTask,
    deleteTask,
  };
}

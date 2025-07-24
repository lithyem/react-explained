
/**
 * Home Page Component - Main Task Management Interface
 * 
 * This is the primary page component that renders the complete task management interface.
 * It provides functionality for:
 * - Displaying task statistics (total, completed, pending)
 * - Adding new tasks with form validation
 * - Toggling task completion status
 * - Deleting tasks with confirmation
 * - Responsive design with loading and error states
 * 
 * The component uses React Query for server state management, React Hook Form for
 * form handling with Zod validation, and shadcn/ui components for consistent styling.
 * Custom hooks are used to separate mutation logic from the UI component.
 */

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CheckCircle, Trash2, ClipboardList, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useTaskMutations } from "@/hooks/use-task-mutations";
import { insertTaskSchema, type Task } from "@shared/schema";
import { z } from "zod";

// Extended form schema with additional validation for better UX
const formSchema = insertTaskSchema.extend({
  title: z.string().min(1, "Task title is required").max(100, "Task title must be less than 100 characters"),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Main Home component that renders the complete task management interface
 * Handles all user interactions and coordinates between UI state and server state
 */
export default function Home() {
  // React Query client for manual cache invalidation
  const queryClient = useQueryClient();
  
  // Custom hook containing all task mutation functions (create, update, delete)
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  // React Hook Form setup with Zod validation for the new task form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  /**
   * React Query hook to fetch all tasks from the API
   * Provides automatic caching, background refetching, and loading states
   */
  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  /**
   * Handles form submission for creating new tasks
   * Validates data, calls mutation, and resets form on success
   * @param data - Validated form data containing task title
   */
  const onSubmit = (data: FormData) => {
    createTask.mutate(data, {
      onSuccess: () => {
        // Reset form to clear input after successful creation
        form.reset();
      },
    });
  };

  /**
   * Toggles a task's completion status
   * Updates both the completed flag and completedAt timestamp
   * @param id - Task ID to update
   * @param completed - Current completion status (will be toggled)
   */
  const toggleTask = (id: number, completed: boolean) => {
    updateTask.mutate({ id, completed: !completed });
  };

  /**
   * Handles task deletion with user confirmation
   * Shows confirmation dialog before permanently removing task
   * @param id - Task ID to delete
   */
  const handleDeleteTask = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id);
    }
  };

  /**
   * Sorts tasks for optimal user experience:
   * 1. Pending tasks first (more actionable)
   * 2. Within each group, newest tasks first
   * This ensures users see their most recent and actionable items first
   */
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      // Same completion status - sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Different completion status - pending tasks first
    return a.completed ? 1 : -1;
  });

  // Separate tasks into categories for organized display
  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  /**
   * Formats timestamps into human-readable relative time strings
   * Provides better UX than showing raw timestamps
   * @param date - ISO date string to format
   * @returns Human-readable time ago string
   */
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else {
      return "Just now";
    }
  };

  /**
   * Error state UI - shows when API requests fail
   * Provides user-friendly error message and retry functionality
   */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Unable to load tasks</h2>
              <p className="text-slate-600 text-sm">
                Please check your connection and try again.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] })}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Main UI render - organized into distinct sections for better maintainability
   */
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      
      {/* Header Section - App branding and description */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
          <ListTodo className="text-blue-500" size={40} />
          TaskFlow
        </h1>
        <p className="text-slate-600 text-lg">Simple. Clean. Productive.</p>
      </div>

      {/* Task Statistics Card - Overview of user's progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600">{tasks.length}</span>
              <span className="text-sm text-slate-500">Total Tasks</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-emerald-600">{completedTasks.length}</span>
              <span className="text-sm text-slate-500">Completed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-orange-600">{pendingTasks.length}</span>
              <span className="text-sm text-slate-500">Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Form - Input for creating new tasks */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="text-blue-500" size={20} />
            Add New Task
          </h2>
          
          {/* Form with validation and submission handling */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your task title..."
                            {...field}
                            className="transition-all duration-200 focus:translate-y-[-1px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={createTask.isPending}
                  className="px-6 py-3 min-w-[120px] transition-all duration-200"
                >
                  <Plus className="mr-2" size={16} />
                  {createTask.isPending ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Loading State - Shows while fetching tasks */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading tasks...</span>
        </div>
      )}

      {/* Task List Section - Main content area */}
      {!isLoading && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20} />
            Your Tasks
          </h2>

          {/* Empty State - Shows when no tasks exist */}
          {tasks.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks yet</h3>
                  <p className="text-slate-500">Add your first task above to get started!</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Tasks Section - High priority, actionable items */}
          {pendingTasks.length > 0 && (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="task-item transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Task completion checkbox */}
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id, task.completed)}
                        disabled={updateTask.isPending}
                        className="transition-all duration-200"
                      />
                      {/* Task details */}
                      <div className="flex-1">
                        <span className="text-slate-800 font-medium">{task.title}</span>
                        <div className="text-xs text-slate-500 mt-1">
                          Created {formatTimeAgo(task.createdAt)}
                        </div>
                      </div>
                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deleteTask.isPending}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Completed Tasks Section - Lower priority, archived items */}
          {completedTasks.length > 0 && (
            <>
              {/* Section header with completion count */}
              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-emerald-500" size={20} />
                  <span className="text-slate-600 font-medium">Completed Tasks</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {completedTasks.length}
                  </span>
                </div>
              </div>

              {/* Completed tasks list with dimmed styling */}
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="task-item bg-slate-50 opacity-75 transition-all duration-300 hover:translate-y-[-1px] hover:shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Completed task checkbox */}
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id, task.completed)}
                          disabled={updateTask.isPending}
                          className="transition-all duration-200"
                        />
                        {/* Completed task details with strikethrough */}
                        <div className="flex-1">
                          <span className="text-slate-600 font-medium line-through">
                            {task.title}
                          </span>
                          <div className="text-xs text-slate-400 mt-1">
                            Completed {task.completedAt ? formatTimeAgo(task.completedAt) : "recently"}
                          </div>
                        </div>
                        {/* Delete button for completed tasks */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteTask.isPending}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer - Simple branding and task count */}
      <div className="text-center mt-12 pt-8 border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          Built with ❤️ for productivity • {tasks.length} tasks managed
        </p>
      </div>
    </div>
  );
}


/**
 * Database Schema Definitions
 * 
 * This file defines the database schema using Drizzle ORM and creates TypeScript types
 * and Zod validation schemas for the task management application. It serves as the
 * single source of truth for data structure across both client and server.
 * 
 * The schema includes:
 * - PostgreSQL table definitions with proper data types and constraints
 * - Zod validation schemas for API request/response validation
 * - TypeScript type definitions for type-safe database operations
 * - Shared types that can be imported by both client and server code
 */

import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Tasks Table Definition
 * 
 * Defines the structure of the 'tasks' table in PostgreSQL database.
 * This table stores all task-related information with proper data types,
 * constraints, and default values.
 */
export const tasks = pgTable("tasks", {
  /**
   * Primary key - Auto-incrementing unique identifier for each task
   * Uses PostgreSQL's SERIAL type which automatically generates sequential integers
   */
  id: serial("id").primaryKey(),
  
  /**
   * Task title/description - Required text field
   * Contains the main content of what the task is about
   * Uses TEXT type to allow for longer descriptions without length limits
   */
  title: text("title").notNull(),
  
  /**
   * Completion status - Boolean flag indicating if task is done
   * Defaults to false (incomplete) when a new task is created
   * Used for filtering and displaying task completion state
   */
  completed: boolean("completed").notNull().default(false),
  
  /**
   * Creation timestamp - When the task was first created
   * Automatically set to current timestamp when task is inserted
   * Used for sorting tasks and tracking task age
   */
  createdAt: timestamp("created_at").notNull().defaultNow(),
  
  /**
   * Completion timestamp - When the task was marked as completed
   * Nullable field that gets set only when task is marked complete
   * Allows tracking of completion time and duration calculations
   */
  completedAt: timestamp("completed_at"),
});

/**
 * Insert Task Validation Schema
 * 
 * Zod schema for validating data when creating new tasks.
 * Only requires the 'title' field since other fields have defaults
 * or are auto-generated (id, createdAt).
 * 
 * Used by API endpoints to validate incoming POST requests.
 */
export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
});

/**
 * Update Task Validation Schema
 * 
 * Zod schema for validating data when updating existing tasks.
 * Currently only allows updating the 'completed' status.
 * 
 * Used by API endpoints to validate incoming PATCH requests.
 * The completedAt timestamp is handled automatically by the storage layer.
 */
export const updateTaskSchema = createInsertSchema(tasks).pick({
  completed: true,
});

/**
 * TypeScript Type Definitions
 * 
 * These types are automatically inferred from the Zod schemas and Drizzle table
 * definitions, ensuring type safety across the entire application stack.
 */

/**
 * Type for creating new tasks
 * Represents the shape of data needed to insert a new task
 * Currently only requires: { title: string }
 */
export type InsertTask = z.infer<typeof insertTaskSchema>;

/**
 * Type for updating existing tasks
 * Represents the shape of data that can be updated on a task
 * Currently only includes: { completed: boolean }
 */
export type UpdateTask = z.infer<typeof updateTaskSchema>;

/**
 * Type for complete task objects
 * Represents the full task object as stored in and retrieved from the database
 * Includes all fields: id, title, completed, createdAt, completedAt
 * 
 * Used throughout the application for type-safe task handling:
 * - API responses
 * - React component props
 * - Database query results
 * - State management
 */
export type Task = typeof tasks.$inferSelect;

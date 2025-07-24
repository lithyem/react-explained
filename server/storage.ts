
/**
 * Storage Layer - Database Operations
 * 
 * This file provides an abstraction layer for all database operations related to tasks.
 * It implements the Repository pattern to separate business logic from data access logic.
 * 
 * The storage layer includes:
 * - Interface definition (IStorage) for contract-based programming
 * - DatabaseStorage implementation using Drizzle ORM
 * - CRUD operations for tasks with proper error handling
 * - Query optimization with proper sorting and indexing
 * 
 * All database operations are async and return typed results based on shared schemas.
 */

import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

/**
 * Storage interface defining the contract for all database operations
 * This allows for easy testing and potential future implementation swapping
 * (e.g., switching from PostgreSQL to MongoDB while keeping the same interface)
 */
export interface IStorage {
  /**
   * Retrieves all tasks from the database
   * @returns Promise resolving to array of all tasks, sorted by completion status and creation date
   */
  getAllTasks(): Promise<Task[]>;
  
  /**
   * Creates a new task in the database
   * @param task - Task data to insert (title is required)
   * @returns Promise resolving to the created task with generated ID and timestamps
   */
  createTask(task: InsertTask): Promise<Task>;
  
  /**
   * Updates an existing task with partial data
   * @param id - Unique task identifier
   * @param updates - Partial task data to update (can include completedAt timestamp)
   * @returns Promise resolving to updated task or undefined if task not found
   */
  updateTask(id: number, updates: Partial<UpdateTask & { completedAt?: Date | null }>): Promise<Task | undefined>;
  
  /**
   * Permanently removes a task from the database
   * @param id - Unique task identifier
   * @returns Promise resolving to boolean indicating if task was found and deleted
   */
  deleteTask(id: number): Promise<boolean>;
}

/**
 * Concrete implementation of IStorage using PostgreSQL with Drizzle ORM
 * Handles all database operations with proper error handling and type safety
 */
export class DatabaseStorage implements IStorage {
  
  /**
   * Retrieves all tasks ordered by completion status (pending first) and creation date (newest first)
   * This ensures a consistent and user-friendly ordering in the UI
   * @returns Array of all tasks from the database
   */
  async getAllTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      // Order by completion status first (false/pending before true/completed)
      // Then by creation date descending (newest first within each group)
      .orderBy(asc(tasks.completed), desc(tasks.createdAt));
  }

  /**
   * Creates a new task with the provided data
   * Auto-generates ID, createdAt timestamp, and sets default values
   * @param task - Task data containing at minimum the title
   * @returns The newly created task with all generated fields
   */
  async createTask(task: InsertTask): Promise<Task> {
    // Insert task and return the created record with generated fields
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning(); // Returns the inserted record with auto-generated fields
    
    return newTask;
  }

  /**
   * Updates a specific task with partial data
   * Commonly used for toggling completion status and setting completion timestamps
   * @param id - Task ID to update
   * @param updates - Object containing fields to update (can be partial)
   * @returns Updated task object or undefined if task doesn't exist
   */
  async updateTask(id: number, updates: Partial<UpdateTask & { completedAt?: Date | null }>): Promise<Task | undefined> {
    // Update task by ID and return the updated record
    const [updatedTask] = await db
      .update(tasks)
      .set(updates) // Apply partial updates to the task
      .where(eq(tasks.id, id)) // Find task by unique ID
      .returning(); // Return the updated record
    
    // Return undefined if no task was found/updated, otherwise return the updated task
    return updatedTask || undefined;
  }

  /**
   * Permanently removes a task from the database
   * This operation cannot be undone, so it should be used with confirmation
   * @param id - Task ID to delete
   * @returns Boolean indicating whether a task was actually deleted
   */
  async deleteTask(id: number): Promise<boolean> {
    // Delete task by ID and return info about deleted records
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id)) // Find task by unique ID
      .returning(); // Return deleted records for confirmation
    
    // Return true if at least one record was deleted, false otherwise
    return result.length > 0;
  }
}

/**
 * Singleton instance of the storage implementation
 * This provides a single point of access to database operations throughout the application
 * Can be easily mocked for testing by replacing this export
 */
export const storage = new DatabaseStorage();


/**
 * API Routes Configuration
 * 
 * This file defines all the REST API endpoints for the task management application.
 * It handles HTTP requests for CRUD operations on tasks including:
 * - GET /api/tasks - Retrieve all tasks
 * - POST /api/tasks - Create a new task
 * - PATCH /api/tasks/:id - Update a task (toggle completion status)
 * - DELETE /api/tasks/:id - Delete a task
 * 
 * All routes include proper error handling, input validation using Zod schemas,
 * and return appropriate HTTP status codes and JSON responses.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { z } from "zod";

/**
 * Registers all API routes with the Express application
 * @param app - Express application instance
 * @returns HTTP server instance for the application
 */
export async function registerRoutes(app: Express): Promise<Server> {
  
  /**
   * GET /api/tasks
   * Retrieves all tasks from the database ordered by completion status and creation date
   * @returns Array of Task objects in JSON format
   */
  app.get("/api/tasks", async (req, res) => {
    try {
      // Fetch all tasks using the storage layer
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  /**
   * POST /api/tasks
   * Creates a new task with the provided title
   * Validates input data against the insertTaskSchema before creating
   * @body {title: string} - Task title (required, 1-100 characters)
   * @returns Created Task object with generated ID and timestamps
   */
  app.post("/api/tasks", async (req, res) => {
    try {
      // Validate request body against schema
      const validatedData = insertTaskSchema.parse(req.body);
      
      // Create new task in database
      const task = await storage.createTask(validatedData);
      
      // Return created task with 201 status
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors with detailed error messages
        res
          .status(400)
          .json({ message: "Invalid task data", errors: error.errors });
      } else {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  /**
   * PATCH /api/tasks/:id
   * Updates a task's completion status and sets completedAt timestamp
   * @param id - Task ID from URL parameters
   * @body {completed: boolean} - New completion status
   * @returns Updated Task object or 404 if task not found
   */
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      // Parse and validate task ID from URL parameter
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      // Prepare update data - set completion status and timestamp
      const updates: any = {};
      if (req.body.completed !== undefined) {
        updates.completed = req.body.completed;
        // Set completedAt timestamp when marking as completed, null when marking as pending
        updates.completedAt = req.body.completed ? new Date() : null;
      }

      // Update task in database
      const task = await storage.updateTask(id, updates);
      
      // Check if task exists and was updated
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  /**
   * DELETE /api/tasks/:id
   * Permanently removes a task from the database
   * @param id - Task ID from URL parameters
   * @returns 204 No Content on success, 404 if task not found
   */
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      // Parse and validate task ID from URL parameter
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      // Attempt to delete task from database
      const deleted = await storage.deleteTask(id);
      
      // Check if task existed and was deleted
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Return 204 No Content for successful deletion
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Create and return HTTP server instance
  const httpServer = createServer(app);
  return httpServer;
}

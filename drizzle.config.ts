/**
 * Drizzle Kit Configuration
 * 
 * This file configures Drizzle Kit, which is used for database schema management,
 * migrations, and code generation. It handles the connection between our TypeScript
 * schema definitions and the actual PostgreSQL database.
 */

import { defineConfig } from "drizzle-kit";

// Ensure database connection is available before proceeding
// This prevents runtime errors when the database isn't properly provisioned
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  // Output directory for generated migration files
  // These SQL files are created when schema changes are detected
  out: "./migrations",
  
  // Location of our TypeScript schema definitions
  // This file contains table definitions that Drizzle uses to generate types and migrations
  schema: "./shared/schema.ts",
  
  // Database dialect - specifies we're using PostgreSQL
  // This affects the SQL syntax and features Drizzle will use
  dialect: "postgresql",
  
  // Database connection configuration
  // Uses environment variable for secure credential management
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});


/**
 * Database Connection Configuration
 * 
 * This file establishes the connection to the PostgreSQL database using Neon's
 * serverless driver and configures Drizzle ORM for type-safe database operations.
 * It serves as the central database connection point for the entire application.
 * 
 * Key components:
 * - Neon serverless PostgreSQL connection with WebSocket support
 * - Drizzle ORM initialization with schema integration
 * - Environment variable validation for database connectivity
 * - Connection pooling for efficient resource management
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

/**
 * WebSocket Configuration for Neon
 * 
 * Neon's serverless driver requires WebSocket support for real-time database connections.
 * In Node.js environments, we need to explicitly provide a WebSocket implementation
 * since the native WebSocket API is not available by default.
 */
neonConfig.webSocketConstructor = ws;

/**
 * Database URL Validation
 * 
 * Ensures that the DATABASE_URL environment variable is properly set before
 * attempting to establish a database connection. This prevents runtime errors
 * and provides clear feedback when the database is not properly configured.
 * 
 * The DATABASE_URL should be a PostgreSQL connection string format:
 * postgresql://username:password@host:port/database
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

/**
 * Connection Pool Instance
 * 
 * Creates a connection pool using the Neon serverless driver.
 * Connection pooling provides several benefits:
 * - Efficient resource utilization by reusing connections
 * - Better performance through connection reuse
 * - Automatic connection management and cleanup
 * - Scalability for handling multiple concurrent requests
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Drizzle Database Instance
 * 
 * Initializes Drizzle ORM with the connection pool and schema definitions.
 * This provides:
 * - Type-safe database queries and mutations
 * - Automatic TypeScript type inference from schema
 * - SQL query building with compile-time validation
 * - Integration with our shared schema types
 * 
 * The schema import ensures that all table definitions and types
 * are available for database operations throughout the application.
 */
export const db = drizzle({ client: pool, schema });

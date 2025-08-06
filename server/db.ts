
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
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
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
 * Database Connection Detection
 * 
 * Determines whether to use Neon serverless driver or standard PostgreSQL driver
 * based on the database URL. Local development uses standard PostgreSQL,
 * while production uses Neon's serverless capabilities.
 */
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech') || 
                      process.env.DATABASE_URL.includes('neon.dev');

/**
 * Connection Pool and Database Instance
 * 
 * Creates appropriate connection pool and database instance based on the environment:
 * - Neon serverless driver for production (WebSocket-based)
 * - Standard PostgreSQL driver for local development
 */
let pool: any;
let db: any;

if (isNeonDatabase) {
  /**
   * Neon Serverless Configuration
   * 
   * Uses Neon's serverless driver for cloud deployments.
   * Provides WebSocket-based connections with automatic scaling.
   */
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
} else {
  /**
   * Standard PostgreSQL Configuration
   * 
   * Uses standard node-postgres driver for local development.
   * Provides traditional TCP connections to PostgreSQL.
   */
  pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };


/**
 * Vite Development Server Integration
 * 
 * This file provides integration between Express.js and Vite during development,
 * enabling hot module replacement (HMR), React development features, and static
 * file serving. It handles both development and production modes with appropriate
 * configurations for each environment.
 * 
 * Key features:
 * - Vite development server integration with Express middleware
 * - Hot module replacement for React components
 * - HTML template transformation and injection
 * - Static file serving for production builds
 * - Security configurations for file system access
 * - Centralized logging with timestamp formatting
 */

import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

/**
 * Vite Logger Instance
 * 
 * Creates a Vite logger instance for handling build and development messages.
 * This logger is customized in setupVite to handle errors appropriately.
 */
const viteLogger = createLogger();

/**
 * Centralized Logging Function
 * 
 * Provides consistent log formatting across the application with timestamps
 * and source identification. Used by both Express server and Vite integration.
 * 
 * @param message - The message to log
 * @param source - The source of the log message (defaults to "express")
 * 
 * Log format: "HH:MM:SS AM/PM [source] message"
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Vite Development Server Setup
 * 
 * Integrates Vite's development server with Express for hot module replacement
 * and React development features. This function configures Vite to work as
 * Express middleware while maintaining all development capabilities.
 * 
 * @param app - Express application instance
 * @param server - HTTP server instance for WebSocket connections
 * 
 * Features:
 * - Middleware mode integration with Express
 * - HMR over WebSocket connections
 * - Custom error handling that exits on fatal errors
 * - HTML template transformation with cache busting
 * - Fallback routing for single-page application
 */
export async function setupVite(app: Express, server: Server) {
  /**
   * Vite Server Configuration
   * 
   * Configures Vite to run in middleware mode, which allows it to be
   * integrated into an existing Express server rather than running standalone.
   */
  const serverOptions = {
    // Middleware mode - integrates with Express instead of running standalone
    middlewareMode: true,
    
    // HMR configuration - uses existing HTTP server for WebSocket connections
    hmr: { server },
    
    // Security setting - allows connections from any host (required for Replit)
    allowedHosts: true as const,
  };

  /**
   * Vite Server Instance Creation
   * 
   * Creates a Vite development server with custom configuration:
   * - Uses imported vite.config.ts settings
   * - Disables config file reading (uses programmatic config)
   * - Custom logger with fatal error handling
   * - Custom app type for Express integration
   */
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false, // Use programmatic config instead of file
    customLogger: {
      ...viteLogger,
      // Custom error handler that exits process on fatal errors
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom", // Indicates custom integration with Express
  });

  /**
   * Vite Middleware Integration
   * 
   * Adds Vite's middleware to Express, enabling:
   * - Module transformation and bundling
   * - Hot module replacement
   * - Import resolution and processing
   * - CSS preprocessing and injection
   */
  app.use(vite.middlewares);
  
  /**
   * Catch-All Route for Single Page Application
   * 
   * Handles all remaining routes by serving the React application.
   * This enables client-side routing to work properly by always
   * serving the main HTML template for unmatched routes.
   */
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      /**
       * HTML Template Processing
       * 
       * Reads the client HTML template and processes it through Vite:
       * 1. Reads index.html from the client directory
       * 2. Adds cache busting parameter to main.tsx import
       * 3. Transforms HTML through Vite (handles imports, CSS, etc.)
       * 4. Sends processed HTML to client
       */
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // Read HTML template from disk (always fresh for development)
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Add cache busting parameter to prevent stale module caching
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      
      // Transform HTML through Vite (processes imports, injects HMR, etc.)
      const page = await vite.transformIndexHtml(url, template);
      
      // Send processed HTML to client
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      // Fix stack trace for better error reporting
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * Static File Serving for Production
 * 
 * Serves pre-built static files in production mode. This function sets up
 * Express to serve the built client application from the dist directory.
 * 
 * @param app - Express application instance
 * 
 * Features:
 * - Serves static files from the build output directory
 * - Fallback to index.html for client-side routing
 * - Build directory validation with helpful error messages
 */
export function serveStatic(app: Express) {
  /**
   * Build Directory Resolution
   * 
   * Resolves the path to the built static files directory.
   * This should contain the output from `vite build`.
   */
  const distPath = path.resolve(import.meta.dirname, "public");

  /**
   * Build Directory Validation
   * 
   * Ensures the build directory exists before attempting to serve files.
   * Provides helpful error message if the build step was missed.
   */
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  /**
   * Static File Middleware
   * 
   * Serves static files (JS, CSS, images, etc.) from the build directory.
   * This handles all asset requests for the production application.
   */
  app.use(express.static(distPath));

  /**
   * Single Page Application Fallback
   * 
   * For any route that doesn't match a static file, serve the main index.html.
   * This enables client-side routing to work properly by ensuring the React
   * application is loaded for all routes.
   */
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

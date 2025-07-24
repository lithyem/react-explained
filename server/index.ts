
/**
 * Express Server Entry Point
 * 
 * This file serves as the main entry point for the Express.js application server.
 * It configures middleware, sets up routing, handles errors, and starts the server.
 * The server supports both development (with Vite integration) and production modes.
 * 
 * Key features:
 * - Express.js web server with JSON and URL-encoded body parsing
 * - Request/response logging middleware for API monitoring
 * - Error handling with proper status codes and JSON responses
 * - Development mode with Vite hot module replacement
 * - Production mode with static file serving
 * - Configurable port binding with fallback defaults
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

/**
 * Express Application Instance
 * 
 * Creates the main Express application instance that will handle all HTTP requests.
 * This serves as the foundation for our REST API and client application serving.
 */
const app = express();

/**
 * Body Parsing Middleware
 * 
 * Configures Express to automatically parse incoming request bodies:
 * - JSON parsing for API requests with Content-Type: application/json
 * - URL-encoded parsing for form submissions with extended object support disabled
 * 
 * This middleware runs on all routes and makes parsed data available via req.body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Request Logging Middleware
 * 
 * Custom middleware that logs API requests and responses for monitoring and debugging.
 * Features:
 * - Measures request duration for performance monitoring
 * - Captures and logs response JSON data for API calls
 * - Filters logging to only API routes (paths starting with /api)
 * - Truncates long log messages to prevent console spam
 * - Provides detailed request/response information for debugging
 */
app.use((req, res, next) => {
  // Record the start time for duration calculation
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept the res.json method to capture response data
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log the request details when the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // Only log API requests to avoid noise from static file requests
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Include response data if available
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate extremely long log lines for readability
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Async Server Initialization
 * 
 * Self-executing async function that sets up the complete server stack:
 * 1. Registers API routes and middleware
 * 2. Sets up error handling
 * 3. Configures development/production environment
 * 4. Starts the server on the specified port
 */
(async () => {
  /**
   * API Routes Registration
   * 
   * Registers all API routes and returns the HTTP server instance.
   * This includes all task-related endpoints and middleware.
   */
  const server = await registerRoutes(app);

  /**
   * Global Error Handler
   * 
   * Express error handling middleware that catches all unhandled errors
   * and sends appropriate JSON responses to clients.
   * Features:
   * - Extracts status code from error object (defaults to 500)
   * - Sends consistent JSON error responses
   * - Re-throws error for logging/monitoring systems
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  /**
   * Environment-Specific Configuration
   * 
   * Sets up different serving strategies based on the NODE_ENV:
   * - Development: Integrates Vite for hot module replacement and dev server
   * - Production: Serves pre-built static files from the dist directory
   * 
   * The order is important - Vite/static serving must come after API routes
   * to prevent the catch-all route from interfering with API endpoints.
   */
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  /**
   * Server Startup
   * 
   * Starts the HTTP server on the configured port with specific binding options:
   * - Port: Uses environment variable PORT or defaults to 5000
   * - Host: Binds to 0.0.0.0 to accept connections from any IP (required for Replit)
   * - reusePort: Enables port reuse for better performance in cluster environments
   * 
   * Port 5000 is specifically chosen as it's the port that Replit forwards
   * to external ports 80 and 443 in production deployments.
   */
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

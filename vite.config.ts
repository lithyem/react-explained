
/**
 * Vite Configuration for Full-Stack Application
 * 
 * This file configures Vite as the build tool and development server for the React client.
 * It sets up plugins, path resolution, build output, and development server settings
 * for a full-stack application with client-side React and Express server.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  // Plugin configuration
  // Plugins extend Vite's functionality with additional features
  plugins: [
    // React plugin - enables JSX transformation and React Fast Refresh
    react(),
    
    // Replit runtime error overlay - shows development errors in a modal
    // Provides better error visualization during development in Replit
    runtimeErrorOverlay(),
    
    // Conditional plugins for Replit development environment
    // Only loads cartographer plugin in development when running in Replit
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // Replit cartographer plugin - provides enhanced development tooling
          // Dynamically imported to avoid loading in production
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  
  // Module resolution configuration
  // Defines how imports are resolved and creates path aliases for cleaner imports
  resolve: {
    alias: {
      // "@" alias points to client source directory
      // Allows imports like: import Component from "@/components/Component"
      "@": path.resolve(import.meta.dirname, "client", "src"),
      
      // "@shared" alias points to shared code directory
      // Enables sharing types and utilities between client and server
      "@shared": path.resolve(import.meta.dirname, "shared"),
      
      // "@assets" alias points to attached assets directory
      // For static assets that need to be referenced in code
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  
  // Root directory configuration
  // Sets the client directory as the root for Vite's file serving
  // This allows Vite to properly serve the React application
  root: path.resolve(import.meta.dirname, "client"),
  
  // Build output configuration
  // Defines where the production build files are placed
  build: {
    // Output directory for built assets
    // Places build files in dist/public for server to serve as static files
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    
    // Empty the output directory before building
    // Ensures clean builds without leftover files from previous builds
    emptyOutDir: true,
  },
  
  // Development server configuration
  // Settings that apply only during development
  server: {
    // File system configuration for security
    fs: {
      // Strict file serving - only serve files within the project
      strict: true,
      
      // Deny access to hidden files and directories
      // Prevents serving sensitive files like .env, .git, etc.
      deny: ["**/.*"],
    },
  },
});

/**
 * Main Application Component
 * 
 * This file serves as the root component of the TaskFlow application.
 * It sets up the core application infrastructure including:
 * - Client-side routing with Wouter
 * - Server state management with React Query
 * - Global UI providers for toasts and tooltips
 * - Error boundaries and fallback components
 * 
 * The component follows a provider pattern to inject dependencies
 * and shared context throughout the component tree.
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

/**
 * Application Router Component
 * 
 * Handles client-side routing using Wouter (lightweight React router).
 * 
 * Route Configuration:
 * - "/" : Home page (main task management interface)
 * - "*" : Catch-all route for 404 pages
 * 
 * Benefits of Wouter over React Router:
 * - Smaller bundle size (~1.5kb vs ~8kb)
 * - Hooks-based API that's familiar and simple
 * - Perfect for SPAs with minimal routing needs
 */
function Router() {
  return (
    <Switch>
      {/* Main application route - displays the task management interface */}
      <Route path="/" component={Home} />
      
      {/* Fallback route - handles all unmatched paths */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root Application Component
 * 
 * Sets up the global application context with required providers.
 * The provider order is important for proper dependency injection:
 * 
 * 1. QueryClientProvider: Enables server state management across the app
 * 2. TooltipProvider: Provides context for Radix UI tooltip components
 * 3. Toaster: Renders toast notifications at the app level
 * 4. Router: Handles page navigation and route matching
 * 
 * Provider Benefits:
 * - Centralized configuration for shared functionality
 * - Consistent behavior across all components
 * - Single source of truth for application-wide state
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* React Query provider for server state management */}
      {/* Provides caching, synchronization, and error handling for API calls */}
      
      <TooltipProvider>
        {/* Radix UI tooltip provider for accessible tooltip components */}
        {/* Enables tooltip functionality throughout the component tree */}
        
        {/* Toast notification system for user feedback */}
        {/* Automatically renders toast messages from anywhere in the app */}
        <Toaster />
        
        {/* Application routing system */}
        {/* Renders the appropriate page component based on current URL */}
        <Router />
        
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

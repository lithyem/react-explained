
/**
 * React Query Configuration & API Client Library
 * 
 * This file provides the central configuration for React Query (TanStack Query) and
 * standardized API communication methods for the entire application. It establishes
 * the foundation for server state management, caching strategies, and HTTP request
 * handling with consistent error management.
 * 
 * Key Features:
 * - Centralized React Query client configuration
 * - Standardized API request wrapper with error handling
 * - Configurable query functions for different authentication scenarios
 * - Optimized caching and refetch behavior for better performance
 * - Cookie-based session management support
 * 
 * Architecture:
 * This module follows the facade pattern, providing a simplified interface
 * for complex React Query operations while maintaining flexibility for
 * custom configurations when needed.
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * HTTP Response Error Handler
 * 
 * Checks if an HTTP response indicates an error status and throws a descriptive
 * error if so. This function provides consistent error handling across all API calls.
 * 
 * @param res - The fetch Response object to validate
 * @throws {Error} Throws an error with status code and message if response is not ok
 * 
 * Error Format: "{status_code}: {error_message}"
 * Examples: "404: Not Found", "500: Internal Server Error"
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Attempt to extract error message from response body
    // Falls back to status text if body is empty or unreadable
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Centralized API Request Function
 * 
 * A standardized wrapper around the fetch API that provides consistent
 * request configuration, error handling, and response processing for all
 * HTTP operations in the application.
 * 
 * Features:
 * - Automatic JSON serialization for request bodies
 * - Consistent header management (Content-Type for JSON requests)
 * - Cookie-based authentication support via credentials: "include"
 * - Unified error handling with descriptive error messages
 * - TypeScript support for request/response types
 * 
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param url - Target URL for the request (relative or absolute)
 * @param data - Optional request body data (will be JSON serialized)
 * @returns Promise<Response> - The fetch Response object after error checking
 * 
 * Usage Examples:
 * ```typescript
 * // GET request
 * const response = await apiRequest('GET', '/api/tasks');
 * 
 * // POST request with data
 * const response = await apiRequest('POST', '/api/tasks', { title: 'New Task' });
 * 
 * // DELETE request
 * const response = await apiRequest('DELETE', `/api/tasks/${taskId}`);
 * ```
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Configure fetch options based on whether data is provided
  const res = await fetch(url, {
    method,
    // Set Content-Type header only when sending data
    // This prevents unnecessary headers on GET/DELETE requests
    headers: data ? { "Content-Type": "application/json" } : {},
    // Serialize data to JSON if provided
    // undefined body is required for GET requests in some browsers
    body: data ? JSON.stringify(data) : undefined,
    // Include cookies for session-based authentication
    // This enables server-side session management
    credentials: "include",
  });

  // Validate response and throw descriptive errors if needed
  await throwIfResNotOk(res);
  return res;
}

/**
 * Unauthorized Request Behavior Configuration
 * 
 * Defines how the query function should handle 401 Unauthorized responses:
 * - "returnNull": Returns null for 401 responses (useful for optional data)
 * - "throw": Throws an error for 401 responses (triggers error boundaries)
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * React Query Function Factory
 * 
 * Creates standardized query functions for React Query that handle GET requests
 * with configurable behavior for authentication failures. This factory pattern
 * allows for consistent query behavior while supporting different authentication
 * scenarios throughout the application.
 * 
 * Query Key Convention:
 * React Query uses the queryKey array to construct the request URL by joining
 * elements with "/". For example: ["/api", "tasks", "123"] becomes "/api/tasks/123"
 * 
 * @param options - Configuration object for query behavior
 * @param options.on401 - How to handle 401 Unauthorized responses
 * @returns QueryFunction<T> - A React Query-compatible query function
 * 
 * Usage Examples:
 * ```typescript
 * // For public data that's optional when not authenticated
 * const publicQueryFn = getQueryFn({ on401: "returnNull" });
 * 
 * // For protected data that requires authentication
 * const protectedQueryFn = getQueryFn({ on401: "throw" });
 * 
 * // Using in useQuery hook
 * const { data } = useQuery({
 *   queryKey: ["/api", "tasks"],
 *   queryFn: publicQueryFn
 * });
 * ```
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Construct URL from query key array
    // Example: ["/api", "tasks", "123"] -> "/api/tasks/123"
    const res = await fetch(queryKey.join("/") as string, {
      // Include cookies for session-based authentication
      credentials: "include",
    });

    // Handle 401 Unauthorized responses based on configuration
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      // Return null for optional data scenarios
      // This allows components to gracefully handle unauthenticated states
      return null;
    }

    // Validate response and throw errors for other failure cases
    await throwIfResNotOk(res);
    
    // Parse and return JSON response
    return await res.json();
  };

/**
 * Global React Query Client Instance
 * 
 * Pre-configured QueryClient with optimized defaults for the application's
 * specific needs. This configuration prioritizes manual control over automatic
 * behavior to provide predictable and efficient data management.
 * 
 * Configuration Philosophy:
 * - Manual Invalidation: Data updates only when explicitly requested
 * - No Background Refetching: Prevents unnecessary network requests
 * - No Automatic Retries: Failures are handled explicitly by the application
 * - Infinite Stale Time: Data remains fresh until manually invalidated
 * 
 * Default Query Configuration:
 * - queryFn: Uses getQueryFn with "throw" behavior for authentication errors
 * - refetchInterval: false - No automatic periodic refetching
 * - refetchOnWindowFocus: false - No refetch when window regains focus
 * - staleTime: Infinity - Data never becomes stale automatically
 * - retry: false - No automatic retry on query failures
 * 
 * Default Mutation Configuration:
 * - retry: false - No automatic retry on mutation failures
 * 
 * Usage in Application:
 * ```typescript
 * // Wrap your app with QueryClientProvider
 * <QueryClientProvider client={queryClient}>
 *   <App />
 * </QueryClientProvider>
 * 
 * // Use in components
 * const { data, isLoading, error } = useQuery({
 *   queryKey: ["/api/tasks"],
 *   // queryFn is provided by default configuration
 * });
 * 
 * // Manual cache invalidation after mutations
 * queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
 * ```
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query function that throws on 401 errors
      // This provides consistent behavior for protected endpoints
      queryFn: getQueryFn({ on401: "throw" }),
      
      // Disable automatic refetching behaviors
      // This gives the application full control over when data is fetched
      refetchInterval: false,           // No periodic background refetching
      refetchOnWindowFocus: false,      // No refetch when user returns to tab
      
      // Cache optimization settings
      staleTime: Infinity,              // Data never becomes stale automatically
      
      // Error handling configuration
      retry: false,                     // No automatic retries on failure
    },
    mutations: {
      // Disable automatic retries for mutations
      // This ensures immediate feedback for failed operations
      retry: false,
    },
  },
});

/*
 * Technical Implementation Notes:
 * 
 * Error Handling Strategy:
 * The error handling in this module follows a fail-fast approach where errors
 * are detected early and propagated with meaningful context. This helps with
 * debugging and provides clear feedback to users.
 * 
 * Performance Considerations:
 * - Infinite stale time prevents unnecessary background requests
 * - Manual invalidation allows precise control over cache updates
 * - Cookie-based auth avoids token management overhead
 * - Query key normalization enables efficient cache lookups
 * 
 * Security Features:
 * - Credentials include cookies for secure session management
 * - No sensitive data stored in query keys or cache
 * - Automatic error handling prevents information leakage
 * 
 * Future Enhancement Opportunities:
 * - Request/response interceptors for logging
 * - Retry logic with exponential backoff for specific error types
 * - Request deduplication for identical concurrent requests
 * - Cache persistence across browser sessions
 * - Request timeout configuration
 * - Offline request queuing
 */

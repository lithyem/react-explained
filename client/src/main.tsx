/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It handles the initial mounting of the React component tree to the DOM
 * and imports the global CSS styles.
 * 
 * Key responsibilities:
 * - Mount the React application to the DOM
 * - Import global CSS and Tailwind styles
 * - Initialize the React 18 concurrent features
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Initialize and mount the React application
 * 
 * Using React 18's createRoot API for:
 * - Concurrent rendering features
 * - Improved performance with automatic batching
 * - Better error boundaries and Suspense support
 * 
 * The non-null assertion (!) is safe here because:
 * - The "root" element is guaranteed to exist in index.html
 * - Vite will fail the build if the element is missing
 */
createRoot(document.getElementById("root")!).render(<App />);

/**
 * Mobile Detection Custom Hook
 * 
 * This custom React hook provides responsive design capabilities by detecting
 * whether the current viewport is considered mobile-sized. It uses the modern
 * matchMedia API for efficient viewport monitoring and automatically updates
 * when the screen size changes.
 * 
 * Key features:
 * - Real-time viewport size detection
 * - Automatic updates on window resize
 * - Performance optimized using matchMedia API
 * - SSR-safe with proper hydration handling
 * - Type-safe boolean return value
 * 
 * Common use cases:
 * - Conditional rendering of mobile vs desktop components
 * - Responsive behavior in JavaScript logic
 * - Dynamic class application based on screen size
 * - Touch vs mouse interaction handling
 * 
 * @returns boolean - true if viewport is mobile-sized, false otherwise
 */

import * as React from "react"

/**
 * Mobile breakpoint threshold in pixels
 * Based on common responsive design standards where anything below 768px
 * is considered mobile. This aligns with Bootstrap and Tailwind CSS conventions.
 * 
 * Breakpoint rationale:
 * - Below 768px: Mobile phones and small tablets (portrait)
 * - 768px and above: Tablets (landscape), laptops, and desktops
 */
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook for detecting mobile viewport sizes
 * 
 * Uses the matchMedia API for efficient viewport monitoring without
 * the performance overhead of constantly checking window.innerWidth
 * on every resize event.
 * 
 * Implementation details:
 * - Initial state is undefined to prevent hydration mismatches in SSR
 * - Uses matchMedia for native browser optimization
 * - Automatically manages event listener lifecycle
 * - Returns definitive boolean value for conditional rendering
 * 
 * @returns boolean - true if current viewport is mobile-sized
 */
export function useIsMobile() {
  /**
   * State to track mobile viewport status
   * Initial value is undefined to handle SSR scenarios gracefully
   * - undefined: Initial state before client-side hydration
   * - true: Viewport is mobile-sized (< 768px)
   * - false: Viewport is desktop-sized (>= 768px)
   */
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    /**
     * Create MediaQueryList for mobile breakpoint detection
     * Uses max-width approach to match mobile-first responsive design patterns
     * 
     * The query checks for: (max-width: 767px)
     * - This means 767px and below will match (mobile)
     * - 768px and above will not match (desktop)
     */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Event handler for viewport size changes
     * Called whenever the media query match status changes
     * 
     * Uses window.innerWidth for consistent measurement with matchMedia
     * Alternative approach could use mql.matches, but this ensures consistency
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    /**
     * Register the change listener for real-time updates
     * This efficiently responds to viewport changes without polling
     */
    mql.addEventListener("change", onChange)
    
    /**
     * Set initial state based on current viewport size
     * This ensures the hook returns the correct value immediately
     * after client-side hydration completes
     */
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    /**
     * Cleanup function to prevent memory leaks
     * Removes the event listener when component unmounts
     * or when the effect re-runs (though dependencies are empty)
     */
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array - effect runs once after mount

  /**
   * Return definitive boolean value
   * The double negation (!!isMobile) converts:
   * - undefined -> false (initial SSR state)
   * - true -> true (mobile viewport)
   * - false -> false (desktop viewport)
   * 
   * This ensures components always receive a boolean for conditional rendering
   */
  return !!isMobile
}

/*
 * Technical Implementation Notes:
 * 
 * Performance Considerations:
 * - Uses matchMedia instead of resize event listeners for better performance
 * - Avoids unnecessary re-renders by using state instead of direct calculations
 * - Efficient event listener management with proper cleanup
 * 
 * Browser Compatibility:
 * - matchMedia is supported in all modern browsers
 * - Graceful degradation in environments without window object (SSR)
 * - No polyfills required for target browser support
 * 
 * SSR Compatibility:
 * - Initial undefined state prevents hydration mismatches
 * - Client-side effect handles actual viewport detection
 * - Safe to use in Next.js, Remix, or other SSR frameworks
 * 
 * Usage Examples:
 * 
 * Basic conditional rendering:
 * ```typescript
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 * ```
 * 
 * Dynamic styling:
 * ```typescript
 * const isMobile = useIsMobile();
 * const containerClass = isMobile ? "mobile-container" : "desktop-container";
 * ```
 * 
 * Conditional behavior:
 * ```typescript
 * const isMobile = useIsMobile();
 * const handleClick = isMobile ? handleTouchClick : handleMouseClick;
 * ```
 * 
 * Integration with other responsive solutions:
 * - Complements CSS media queries for JavaScript-driven responsive behavior
 * - Works alongside Tailwind's responsive utilities
 * - Can be combined with other viewport detection libraries
 */

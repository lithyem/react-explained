/**
 * Tailwind CSS Configuration
 * 
 * This file configures Tailwind CSS for the entire application, including
 * custom theme extensions, dark mode support, and shadcn/ui integration.
 * The configuration enables consistent styling across all components.
 */

import type { Config } from "tailwindcss";

export default {
  // Dark mode configuration - uses class-based toggling
  // This allows manual control over dark/light mode via CSS classes
  darkMode: ["class"],
  
  // Content paths - tells Tailwind where to look for class usage
  // This enables tree-shaking to remove unused CSS in production
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  
  theme: {
    extend: {
      // Custom border radius values using CSS custom properties
      // This allows dynamic theming and consistent radius across components
      borderRadius: {
        lg: "var(--radius)", // Large radius from CSS variable
        md: "calc(var(--radius) - 2px)", // Medium radius (calculated)
        sm: "calc(var(--radius) - 4px)", // Small radius (calculated)
      },
      // Custom color system using CSS custom properties
      // This enables dynamic theming and consistent color usage across the app
      // Each color references a CSS variable that can be changed for different themes
      colors: {
        // Base application colors
        background: "var(--background)", // Main background color
        foreground: "var(--foreground)", // Main text color
        
        // Component-specific colors
        card: {
          DEFAULT: "var(--card)", // Card background
          foreground: "var(--card-foreground)", // Card text color
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      
      // Custom keyframe animations for interactive components
      // These animations provide smooth transitions for UI elements
      keyframes: {
        // Accordion expand animation - smoothly reveals content
        "accordion-down": {
          from: {
            height: "0", // Start collapsed
          },
          to: {
            height: "var(--radix-accordion-content-height)", // Expand to full content height
          },
        },
        // Accordion collapse animation - smoothly hides content
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)", // Start at full height
          },
          to: {
            height: "0", // Collapse to zero height
          },
        },
      },
      
      // Animation utility classes that can be used in components
      // These reference the keyframes defined above with timing and easing
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // Fast, smooth expand
        "accordion-up": "accordion-up 0.2s ease-out", // Fast, smooth collapse
      },
    },
  },
  
  // Tailwind CSS plugins that extend functionality
  plugins: [
    // Adds additional animation utilities and improved animation support
    require("tailwindcss-animate"),
    
    // Adds typography utilities for styling text content (prose classes)
    require("@tailwindcss/typography")
  ],
} satisfies Config;

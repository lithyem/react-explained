
/**
 * NotFound Component - 404 Error Page
 * 
 * This component renders a user-friendly 404 error page that displays when users
 * navigate to routes that don't exist in the application. It provides clear
 * messaging about the error and helpful guidance for both users and developers.
 * 
 * Features:
 * - Clean, centered layout using shadcn/ui Card components
 * - Visual error indication with Lucide React AlertCircle icon
 * - Developer-friendly messaging that hints at missing route configuration
 * - Responsive design that works across all device sizes
 * - Consistent styling that matches the application's design system
 * 
 * Usage:
 * This component is automatically rendered by the router (wouter) when no other
 * routes match the current URL path. It's configured as a catch-all route in App.tsx.
 * 
 * @returns JSX.Element - The rendered 404 error page
 */

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    // Full-screen container with centered content
    // Uses flexbox for perfect vertical and horizontal centering
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Main error card with responsive width and margin */}
      {/* max-w-md ensures readability on larger screens */}
      {/* mx-4 provides horizontal margin on mobile devices */}
      <Card className="w-full max-w-md mx-4">
        {/* Card content with top padding to balance the layout */}
        <CardContent className="pt-6">
          {/* Header section with icon and title */}
          {/* Flexbox layout for horizontal alignment of icon and text */}
          <div className="flex mb-4 gap-2">
            {/* Error icon from Lucide React */}
            {/* Red color provides visual indication of error state */}
            <AlertCircle className="h-8 w-8 text-red-500" />
            
            {/* Main error heading */}
            {/* Uses semantic h1 for accessibility and SEO */}
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          {/* Developer guidance message */}
          {/* Provides helpful context about potential cause of the error */}
          {/* Uses muted text color to distinguish from main heading */}
          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/*
 * Technical Implementation Notes:
 * 
 * Styling Strategy:
 * - Uses Tailwind CSS utility classes for rapid, consistent styling
 * - Follows the application's gray color palette (gray-50, gray-600, gray-900)
 * - Responsive design with mobile-first approach
 * 
 * Accessibility Considerations:
 * - Semantic HTML with proper heading hierarchy (h1)
 * - High contrast colors for text readability
 * - Icon provides visual context alongside text
 * - Card structure provides clear content boundaries
 * 
 * Component Dependencies:
 * - @/components/ui/card: shadcn/ui Card components for layout structure
 * - lucide-react: AlertCircle icon for visual error indication
 * 
 * Router Integration:
 * This component works with wouter's routing system as a catch-all route:
 * 
 * <Switch>
 *   <Route path="/" component={Home} />
 *   <Route component={NotFound} /> // Catches all unmatched routes
 * </Switch>
 * 
 * Future Enhancements:
 * - Add navigation button to return to home page
 * - Include search functionality for finding content
 * - Add analytics tracking for 404 events
 * - Customize message based on the attempted URL
 * - Add breadcrumb navigation for context
 */


# UI Components Directory - shadcn/ui Library

This directory contains the complete shadcn/ui component library - a collection of copy-pastable, accessible, and customizable UI components built on top of Radix UI primitives. These components form the foundation of the TaskFlow application's user interface.

## Overview

The `ui/` folder contains **50+ pre-built React components** that provide:
- **Accessibility**: Full ARIA compliance with keyboard navigation support
- **Customization**: Tailwind CSS-based styling with CSS variable theming
- **Type Safety**: Complete TypeScript integration with proper type definitions
- **Consistency**: Unified design system across the entire application
- **Performance**: Optimized components with minimal bundle impact

## Architecture

### Technology Stack
- **Radix UI**: Headless, accessible component primitives
- **Tailwind CSS**: Utility-first styling with CSS variables
- **Class Variance Authority (CVA)**: Type-safe component variants
- **TypeScript**: Full type safety and IntelliSense support
- **React 18**: Modern React patterns with forwardRef and hooks

### Styling System
Components use a sophisticated styling system:
```css
/* CSS Variables for theming (defined in src/index.css) */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  /* ... 20+ more theme variables */
}
```

## Component Categories

### Form & Input Components
Essential for user interactions and data entry:

- **`form.tsx`**: Complete form wrapper with React Hook Form integration
- **`input.tsx`**: Text input fields with validation states and focus styling
- **`textarea.tsx`**: Multi-line text input with auto-resize capability
- **`label.tsx`**: Accessible form labels with proper association
- **`checkbox.tsx`**: Checkboxes with indeterminate and disabled states
- **`radio-group.tsx`**: Radio button groups with keyboard navigation
- **`select.tsx`**: Dropdown select menus with search and multi-select
- **`switch.tsx`**: Toggle switches for boolean settings

**Usage Example**:
```typescript
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function TaskForm() {
  return (
    <Form>
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Task Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter task..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="submit">Create Task</Button>
    </Form>
  )
}
```

### Layout & Structure Components
Building blocks for application layout:

- **`card.tsx`**: Content containers with header, content, and footer sections
- **`separator.tsx`**: Visual dividers and spacers between content sections
- **`scroll-area.tsx`**: Custom scrollable areas with styled scrollbars
- **`resizable.tsx`**: Resizable panels and layouts for complex interfaces
- **`aspect-ratio.tsx`**: Maintain consistent aspect ratios for media content
- **`sheet.tsx`**: Slide-out panels and drawers from screen edges
- **`sidebar.tsx`**: Application sidebar layouts with collapsible sections

**Usage Example**:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function TaskCard({ task }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{task.description}</p>
      </CardContent>
    </Card>
  )
}
```

### Interactive Components
User interface elements for actions and interactions:

- **`button.tsx`**: Primary action buttons with 6 variants (default, destructive, outline, secondary, ghost, link)
- **`dialog.tsx`**: Modal dialogs with backdrop and focus management
- **`dropdown-menu.tsx`**: Context menus and action dropdowns
- **`popover.tsx`**: Floating content panels positioned relative to triggers
- **`tooltip.tsx`**: Informational tooltips with smart positioning
- **`alert-dialog.tsx`**: Confirmation dialogs for destructive actions
- **`hover-card.tsx`**: Rich hover cards with additional content

**Button Variants**:
```typescript
import { Button } from "@/components/ui/button"

// Available variants
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete Task</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>
<Button variant="link">Text Link</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🗑️</Button>
```

### Navigation Components
Components for application navigation and wayfinding:

- **`navigation-menu.tsx`**: Complex navigation menus with dropdowns
- **`breadcrumb.tsx`**: Breadcrumb navigation showing page hierarchy
- **`pagination.tsx`**: Page navigation controls for data sets
- **`tabs.tsx`**: Tab navigation interface for content switching
- **`menubar.tsx`**: Application menu bars with keyboard shortcuts

### Feedback & Status Components
Components for user feedback and system status:

- **`toast.tsx`** & **`toaster.tsx`**: Notification system for success/error messages
- **`alert.tsx`**: Alert messages and banners for important information
- **`progress.tsx`**: Progress bars for loading states and completion tracking
- **`skeleton.tsx`**: Loading skeletons for better perceived performance
- **`badge.tsx`**: Status indicators, tags, and labels

**Toast Usage**:
```typescript
import { useToast } from "@/hooks/use-toast"

function TaskActions() {
  const { toast } = useToast()
  
  const handleSuccess = () => {
    toast({
      title: "Task created",
      description: "Your task has been successfully created.",
    })
  }
}
```

### Data Display Components
Components for presenting information:

- **`table.tsx`**: Data tables with sorting, filtering, and pagination
- **`avatar.tsx`**: User profile images with fallback initials
- **`calendar.tsx`**: Date picker and calendar interfaces
- **`chart.tsx`**: Data visualization components for analytics
- **`accordion.tsx`**: Collapsible content sections
- **`collapsible.tsx`**: Show/hide content with animations

### Advanced Components
Complex components for sophisticated interactions:

- **`command.tsx`**: Command palette for quick actions and search
- **`context-menu.tsx`**: Right-click context menus
- **`drawer.tsx`**: Mobile-friendly slide-up panels
- **`carousel.tsx`**: Image and content carousels
- **`slider.tsx`**: Range inputs and value sliders
- **`toggle.tsx`** & **`toggle-group.tsx`**: Toggle buttons and groups

## Configuration & Customization

### Theme Configuration
Components inherit from the global theme configuration in `components.json`:

```json
{
  "style": "new-york",
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  }
}
```

### Variant System
Components use Class Variance Authority for type-safe variants:

```typescript
// Example from button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
)
```

### Custom Styling
Components accept custom classes while maintaining type safety:

```typescript
import { cn } from "@/lib/utils"

// Merge custom classes with component styles
<Button className={cn("w-full", customClass)} variant="outline">
  Custom Styled Button
</Button>
```

## Development Workflow

### Adding New Components
Use the shadcn/ui CLI to add components as needed:

```bash
# Add a specific component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add card input form

# List available components
npx shadcn@latest add --list
```

### Component Updates
Components can be updated by re-running the add command:

```bash
# Update existing component to latest version
npx shadcn@latest add button --overwrite
```

### Custom Component Creation
Follow the established patterns when creating custom components:

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const customVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        custom: "custom-styles",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CustomProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof customVariants> {
  // Custom props
}

const Custom = React.forwardRef<HTMLDivElement, CustomProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(customVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Custom.displayName = "Custom"

export { Custom, customVariants }
```

## Integration with TaskFlow

### Current Usage
The TaskFlow application currently uses these components:
- **Form components**: `form.tsx`, `input.tsx`, `label.tsx` for task creation
- **Layout components**: `card.tsx` for task containers
- **Interactive components**: `button.tsx`, `checkbox.tsx` for task actions
- **Feedback components**: `toast.tsx` for notifications

### Import Patterns
Components are imported using path aliases defined in `tsconfig.json`:

```typescript
// ✅ Correct: Import from ui directory
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// ❌ Incorrect: Direct path imports
import Button from "../ui/button"
```

## Accessibility Features

### Keyboard Navigation
- **Tab order**: Logical focus flow through interactive elements
- **Arrow keys**: Navigate through menus, tabs, and lists
- **Enter/Space**: Activate buttons and toggles
- **Escape**: Close dialogs and dropdowns

### Screen Reader Support
- **ARIA labels**: Descriptive labels for all interactive elements
- **Role attributes**: Proper semantic roles (button, dialog, menu, etc.)
- **State announcements**: Changes in component states are announced
- **Focus management**: Focus is properly managed in modal interactions

### Visual Accessibility
- **High contrast**: Sufficient color contrast ratios
- **Focus indicators**: Clear visual focus indicators
- **Reduced motion**: Respects user's motion preferences
- **Scalable text**: Components work with browser zoom up to 200%

## Performance Considerations

### Bundle Optimization
- **Tree shaking**: Only imported components are included in bundles
- **Code splitting**: Components can be lazy-loaded as needed
- **Minimal dependencies**: Each component has minimal external dependencies

### Runtime Performance
- **Memoization**: Components use React.memo and useMemo where appropriate
- **Event delegation**: Efficient event handling patterns
- **Lazy evaluation**: Expensive computations are deferred until needed

## Best Practices

### Component Usage
```typescript
// ✅ Good: Use semantic HTML and proper variants
<Button variant="destructive" size="sm" aria-label="Delete task">
  <TrashIcon className="h-4 w-4" />
  Delete
</Button>

// ❌ Avoid: Generic styling without semantic meaning
<div className="bg-red-500 text-white px-4 py-2 cursor-pointer">
  Delete
</div>
```

### Composition Patterns
```typescript
// ✅ Good: Compose components for complex UI
<Card>
  <CardHeader>
    <CardTitle>Task Details</CardTitle>
  </CardHeader>
  <CardContent>
    <Form>
      <FormField name="title">
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input />
        </FormControl>
      </FormField>
    </Form>
  </CardContent>
</Card>
```

### Error Handling
```typescript
// ✅ Good: Handle component errors gracefully
try {
  return <ComplexComponent {...props} />
} catch (error) {
  return <Alert variant="destructive">Component failed to load</Alert>
}
```

## Future Enhancements

This component library will evolve to include:
- **Additional variants**: More styling options for existing components
- **Custom components**: Application-specific components built on these primitives
- **Animation enhancements**: More sophisticated animations and transitions
- **Mobile optimizations**: Better touch interactions and mobile-specific components
- **Dark mode improvements**: Enhanced dark theme support

The shadcn/ui component library provides a solid foundation for building modern, accessible, and performant React applications while maintaining design consistency and developer productivity.

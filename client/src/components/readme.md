
# Components Directory

This directory contains all the UI components for the TaskFlow React application. It's organized to separate reusable UI primitives from application-specific components, following modern React component architecture patterns.

## Directory Structure

```
components/
├── ui/                    # Base UI component library (shadcn/ui)
│   ├── button.tsx         # Button component with variants
│   ├── card.tsx          # Card layout components
│   ├── input.tsx         # Form input components
│   ├── dialog.tsx        # Modal dialog components
│   ├── toast.tsx         # Notification components
│   └── ...               # 50+ other UI primitives
└── readme.md             # This documentation file
```

## Component Categories

### UI Primitives (`/ui` folder)

This folder contains **shadcn/ui** components - a collection of copy-pastable, accessible, and customizable UI components built on top of Radix UI primitives. These are:

#### Core Components
- **`button.tsx`**: Button with multiple variants (default, destructive, outline, secondary, ghost, link)
- **`input.tsx`**: Form input field with proper focus states and validation styling
- **`card.tsx`**: Layout component for content containers (Card, CardContent, CardHeader, etc.)
- **`dialog.tsx`**: Modal dialogs and popups with backdrop and accessibility features

#### Form Components
- **`form.tsx`**: Form wrapper with React Hook Form integration
- **`label.tsx`**: Accessible form labels
- **`textarea.tsx`**: Multi-line text input
- **`checkbox.tsx`**: Checkboxes with proper states
- **`radio-group.tsx`**: Radio button groups
- **`select.tsx`**: Dropdown select components
- **`switch.tsx`**: Toggle switches

#### Navigation Components
- **`navigation-menu.tsx`**: Complex navigation menus
- **`breadcrumb.tsx`**: Breadcrumb navigation
- **`pagination.tsx`**: Page navigation controls
- **`tabs.tsx`**: Tab navigation interface

#### Layout Components
- **`separator.tsx`**: Visual dividers and spacers
- **`scroll-area.tsx`**: Custom scrollable areas
- **`resizable.tsx`**: Resizable panels and layouts
- **`aspect-ratio.tsx`**: Maintain aspect ratios for media
- **`sheet.tsx`**: Slide-out panels and drawers
- **`sidebar.tsx`**: Application sidebar layouts

#### Feedback Components
- **`toast.tsx`** & **`toaster.tsx`**: Notification system
- **`alert.tsx`**: Alert messages and banners
- **`progress.tsx`**: Progress bars and loading indicators
- **`skeleton.tsx`**: Loading skeletons for better UX

#### Data Display
- **`table.tsx`**: Data tables with sorting and filtering
- **`badge.tsx`**: Status indicators and tags
- **`avatar.tsx`**: User profile images and initials
- **`calendar.tsx`**: Date picker and calendar views
- **`chart.tsx`**: Data visualization components

#### Advanced Interactions
- **`command.tsx`**: Command palette and search interfaces
- **`context-menu.tsx`**: Right-click context menus
- **`dropdown-menu.tsx`**: Dropdown action menus
- **`hover-card.tsx`**: Hover-triggered content cards
- **`popover.tsx`**: Positioned popup content
- **`tooltip.tsx`**: Hover tooltips and help text

## Component Architecture

### Design System Integration
All components follow a consistent design system:
- **Tailwind CSS**: Utility-first styling with custom CSS variables
- **CSS Variables**: Theme-aware colors that support light/dark mode
- **Radix UI**: Accessible headless components as the foundation
- **TypeScript**: Full type safety for props and component APIs

### Styling Approach
```typescript
// Example component structure
const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
```

### Key Features
- **Variant-based Design**: Each component supports multiple visual variants
- **Accessibility First**: ARIA attributes, keyboard navigation, and screen reader support
- **Composable**: Components can be combined to create complex interfaces
- **Customizable**: Easy to override styles while maintaining consistency
- **TypeScript**: Full type safety with IntelliSense support

## Usage Patterns

### Basic Usage
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function TaskCard({ title, onEdit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onEdit} variant="outline">
          Edit Task
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Form Integration
```typescript
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function TaskForm() {
  const form = useForm()
  
  return (
    <Form {...form}>
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

## Component Generation

### Adding New Components
Components are generated using the shadcn/ui CLI:

```bash
# Add a new component
npx shadcn-ui@latest add [component-name]

# Example: Add a data table component
npx shadcn-ui@latest add table
```

### Configuration
The components are configured via `components.json`:
- **Style**: "new-york" variant for refined aesthetics
- **TypeScript**: All components are generated as .tsx files
- **Path Aliases**: Uses `@/components/ui/` import path
- **CSS Variables**: Theme colors use CSS custom properties

## Customization

### Theme Variables
Components use CSS variables defined in `src/index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more theme variables */
}
```

### Component Variants
Each component supports multiple variants:
- **Button**: default, destructive, outline, secondary, ghost, link
- **Alert**: default, destructive
- **Badge**: default, secondary, destructive, outline

### Size Modifiers
Many components support size variants:
- **Button**: default, sm, lg, icon
- **Input**: default, sm, lg
- **Badge**: default, sm, lg

## Best Practices

### Import Patterns
```typescript
// ✅ Good: Import specific components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// ❌ Avoid: Barrel imports for better tree shaking
import * as UI from "@/components/ui"
```

### Composition Over Customization
```typescript
// ✅ Good: Compose multiple components
<Card className="border-red-200">
  <CardHeader>
    <Badge variant="destructive">Urgent</Badge>
    <CardTitle>Task Title</CardTitle>
  </CardHeader>
</Card>

// ❌ Avoid: Heavy customization of base components
<CustomCard urgentStyle redBorder titleBadge="urgent" />
```

### Accessibility
All components include:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Future Additions

### Potential Components
- **Data Visualization**: Charts and graphs for task analytics
- **Rich Text Editor**: For detailed task descriptions
- **File Upload**: For task attachments
- **Date/Time Pickers**: For task scheduling
- **Search/Filter**: Advanced task filtering interfaces

### Application-Specific Components
Future application-specific components would be added at the root of this directory:
- `TaskList.tsx`: Task list container component
- `TaskItem.tsx`: Individual task display component
- `TaskForm.tsx`: Task creation/editing form
- `TaskFilters.tsx`: Task filtering interface

This component library provides a solid foundation for building consistent, accessible, and maintainable user interfaces throughout the TaskFlow application.


# Shared Code Directory

This folder contains code that is shared between both the client (React frontend) and server (Express backend) parts of the task management application. By centralizing common definitions here, we ensure type safety and consistency across the entire full-stack application.

## What This Folder Contains

### Database Schema Definitions (`schema.ts`)
The main file in this directory defines:
- **PostgreSQL table structures** using Drizzle ORM
- **Zod validation schemas** for API request/response validation
- **TypeScript type definitions** for type-safe operations
- **Shared data contracts** between frontend and backend

## Why Share Code?

### Type Safety Across the Stack
```
Client (React)     ←→     Server (Express)
    ↓                         ↓
shared/schema.ts  ←→   shared/schema.ts
    ↓                         ↓
Same Types        ←→     Same Types
```

### Benefits of Shared Schema
1. **Single Source of Truth**: Database structure defined once, used everywhere
2. **Compile-Time Safety**: TypeScript catches type mismatches before runtime
3. **API Contract**: Both client and server use identical data structures
4. **Validation Consistency**: Same Zod schemas validate data on both ends
5. **Refactoring Safety**: Schema changes automatically propagate to both sides

## Current Schema Structure

### Tasks Table
The application currently uses a simple task-centric data model:

```typescript
tasks {
  id: serial (primary key)           // Auto-incrementing unique identifier
  title: text (required)             // Task description/content
  completed: boolean (default: false) // Completion status
  createdAt: timestamp (auto)        // When task was created
  completedAt: timestamp (nullable)  // When task was completed
}
```

### Validation Schemas
- **`insertTaskSchema`**: Validates new task creation (requires: title)
- **`updateTaskSchema`**: Validates task updates (allows: completed status)

### TypeScript Types
- **`Task`**: Complete task object with all fields
- **`InsertTask`**: Data needed to create a new task
- **`UpdateTask`**: Data that can be updated on existing tasks

## Integration with Application

### Client-Side Usage
```typescript
import { Task, InsertTask, UpdateTask } from '@shared/schema';

// React components use these types for props
interface TaskListProps {
  tasks: Task[];
}

// Forms use validation schemas
const { data } = insertTaskSchema.parse(formData);
```

### Server-Side Usage
```typescript
import { tasks, insertTaskSchema, updateTaskSchema } from '@shared/schema';

// Database operations use table definitions
const allTasks = await db.select().from(tasks);

// API routes use validation schemas
const validatedData = insertTaskSchema.parse(req.body);
```

## Development Workflow

### Making Schema Changes
1. **Edit `schema.ts`**: Update table definitions or validation rules
2. **Generate Migration**: Run `npm run db:generate` to create SQL migration
3. **Apply Migration**: Run `npm run db:migrate` to update database
4. **Types Update**: TypeScript types automatically reflect changes
5. **Code Updates**: Both client and server get new types immediately

### Adding New Tables
When adding new tables:
1. Define table structure in `schema.ts`
2. Create Zod validation schemas for the table
3. Export TypeScript types for the new table
4. Generate and apply database migration
5. Update storage layer to handle new operations

## File Organization

```
shared/
├── schema.ts           # Main schema definitions
├── readme.md          # This documentation file
└── (future files)     # Additional shared utilities as needed
```

## Future Expansion

This folder may grow to include:
- **Shared utilities**: Common helper functions
- **API types**: Request/response interfaces
- **Constants**: Application-wide configuration values
- **Validation helpers**: Custom Zod validators
- **Business logic**: Domain-specific rules shared across tiers

## Design Principles

### Minimal Dependencies
- Only includes what truly needs to be shared
- Avoids frontend-specific or backend-specific code
- Keeps bundle size small for client applications

### Framework Agnostic
- Pure TypeScript/JavaScript without framework dependencies
- Can be used by any client or server implementation
- Enables potential migration to different frameworks

### Version Compatibility
- Changes maintain backward compatibility when possible
- Breaking changes require coordinated updates to client and server
- Migration scripts handle database schema evolution

This shared code directory is essential for maintaining type safety, reducing duplication, and ensuring consistency across the full-stack TypeScript application.

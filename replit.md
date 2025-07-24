# Task Manager Application

## Overview

This is a full-stack task management application built with React, Express, and PostgreSQL. The application uses modern web technologies including TypeScript, Tailwind CSS, and shadcn/ui components to create a clean and responsive task management interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
The application follows a monorepo structure with shared code between client and server, enabling type safety across the entire stack. The architecture separates concerns into distinct layers: presentation (React), API (Express), business logic (storage layer), and data persistence (PostgreSQL with Drizzle ORM).

### Client-Server Architecture
- **Frontend**: React SPA with Vite as the build tool
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Neon serverless hosting
- **Shared**: Common schemas and types between client and server

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** with shadcn/ui component library for consistent styling
- **React Query** for server state management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with structured error handling
- **Drizzle ORM** for type-safe database operations
- **Zod schemas** for request/response validation
- **Storage abstraction layer** for database operations

### Database Schema
The application uses a simple task-centric schema:
- **tasks** table: id, title, completed, createdAt, completedAt
- **users** table: id, username, password (kept for compatibility)

### Component System
- **shadcn/ui components** for consistent UI elements
- **Radix UI primitives** for accessible component foundations
- **Custom theme system** with CSS variables for light/dark mode support
- **Responsive design** with mobile-first approach

## Data Flow

### Task Management Flow
1. **Create Task**: Frontend form → validation → API POST → database insert → UI update
2. **Toggle Task**: Checkbox click → API PATCH → database update → optimistic UI update
3. **Delete Task**: Delete button → API DELETE → database removal → UI refresh
4. **Fetch Tasks**: Page load → API GET → database query → UI rendering

### State Management
- **Server State**: React Query manages API calls, caching, and synchronization
- **Client State**: React Hook Form handles form state and validation
- **UI State**: Local component state for UI interactions

### Error Handling
- **API Errors**: Structured error responses with status codes
- **Client Errors**: Toast notifications for user feedback
- **Validation Errors**: Form-level and field-level error display

## External Dependencies

### UI Components
- **@radix-ui packages**: Accessible component primitives
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe component variants

### Database & Backend
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe ORM with schema generation
- **drizzle-zod**: Automatic Zod schema generation from database schemas

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast backend bundling for production
- **PostCSS**: CSS processing for Tailwind

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling integration

## Deployment Strategy

### Development Environment
- **Vite dev server** for frontend with HMR
- **tsx** for running TypeScript server in development
- **Concurrent development** with frontend and backend running together

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment-specific configuration
- **Replit-specific**: Development vs production feature flags

### Database Management
- **Drizzle Kit**: Schema migration and management
- **Connection pooling**: Neon serverless with WebSocket support
- **Migration strategy**: Schema files in `shared/` for type sharing

The application is designed for easy deployment on Replit with automatic database provisioning and environment setup.
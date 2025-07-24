
# Server Directory

This folder contains the backend implementation of the task management application. It provides a REST API built with Express.js and TypeScript, handling all server-side operations including database interactions, request validation, and client application serving.

## What This Folder Contains

### Core Server Files

#### `index.ts` - Application Entry Point
The main server file that bootstraps the entire Express application:
- **Express Configuration**: Sets up middleware for JSON parsing and request logging
- **Route Registration**: Integrates all API endpoints from routes.ts
- **Error Handling**: Global error handler for consistent API responses
- **Environment Setup**: Configures development (Vite integration) vs production (static serving)
- **Server Startup**: Binds to port 5000 with proper host configuration for Replit

#### `routes.ts` - API Endpoint Definitions
Defines all REST API endpoints for task management:
- **GET /api/tasks**: Retrieve all tasks with proper ordering
- **POST /api/tasks**: Create new tasks with validation
- **PATCH /api/tasks/:id**: Update task completion status and timestamps
- **DELETE /api/tasks/:id**: Remove tasks from database
- **Input Validation**: Uses Zod schemas for request validation
- **Error Responses**: Structured JSON error messages with appropriate HTTP status codes

#### `storage.ts` - Data Access Layer
Implements the Repository pattern for database operations:
- **IStorage Interface**: Contract defining all database operations
- **DatabaseStorage Class**: Concrete implementation using Drizzle ORM
- **CRUD Operations**: Create, read, update, delete operations for tasks
- **Query Optimization**: Proper sorting and indexing strategies
- **Type Safety**: Full TypeScript integration with shared schemas

#### `db.ts` - Database Connection
Manages the PostgreSQL database connection using Neon serverless:
- **Connection Pool**: Efficient connection management with automatic cleanup
- **Drizzle Integration**: ORM configuration with schema integration
- **WebSocket Support**: Required configuration for Neon's serverless driver
- **Environment Validation**: Ensures DATABASE_URL is properly configured

#### `vite.ts` - Development Integration
Handles development server setup and production static file serving:
- **Development Mode**: Vite middleware integration with hot module replacement
- **Production Mode**: Static file serving from build directory
- **HTML Processing**: Template transformation and cache busting
- **Logging**: Centralized logging with timestamp formatting

## Architecture Overview

### Request Flow
```
Client Request → Express Middleware → Routes → Storage Layer → Database
      ↓              ↓                ↓           ↓            ↓
   Validation → Logging → Controller → Repository → PostgreSQL
      ↓              ↓                ↓           ↓            ↓
   Response ← Error Handler ← Business Logic ← Data Access ← SQL Query
```

### Layer Separation
1. **Presentation Layer** (`routes.ts`): HTTP request/response handling
2. **Business Layer** (`storage.ts`): Application logic and data validation
3. **Data Layer** (`db.ts`): Database connection and query execution
4. **Infrastructure** (`index.ts`, `vite.ts`): Server setup and environment configuration

## Database Integration

### ORM Strategy
The application uses **Drizzle ORM** for type-safe database operations:
- **Schema Definition**: Shared between client and server via `@shared/schema`
- **Type Generation**: Automatic TypeScript types from database schema
- **Query Building**: SQL-like syntax with compile-time validation
- **Migration Support**: Schema versioning through Drizzle Kit

### Connection Management
- **Neon Serverless**: PostgreSQL hosting optimized for serverless environments
- **Connection Pooling**: Automatic connection reuse and cleanup
- **Environment Variables**: Secure database URL configuration
- **WebSocket Support**: Required for real-time database features

## API Design

### RESTful Conventions
The API follows REST principles with clear resource modeling:
- **Resource**: `/api/tasks` represents the task collection
- **HTTP Methods**: Semantic use of GET, POST, PATCH, DELETE
- **Status Codes**: Appropriate HTTP status codes for different scenarios
- **JSON Responses**: Consistent response format across all endpoints

### Error Handling Strategy
```typescript
{
  "message": "Human readable error description",
  "errors": [...] // Detailed validation errors when applicable
}
```

### Request/Response Flow
1. **Request Validation**: Zod schemas validate incoming data
2. **Business Logic**: Storage layer handles data operations
3. **Database Operations**: Drizzle ORM executes type-safe queries
4. **Response Formatting**: Consistent JSON responses with proper status codes

## Development vs Production

### Development Mode (`NODE_ENV=development`)
- **Vite Integration**: Hot module replacement for React frontend
- **Source Maps**: Full debugging support with TypeScript
- **Development Logging**: Detailed request/response logging
- **Error Overlay**: Enhanced error reporting through Replit integration

### Production Mode (`NODE_ENV=production`)
- **Static Serving**: Pre-built client assets from dist directory
- **Optimized Bundles**: Minified and compressed JavaScript/CSS
- **Performance Monitoring**: Essential logging without debug noise
- **Security**: Production-ready security headers and configurations

## Key Features

### Type Safety Across the Stack
- **Shared Schemas**: Database types shared between client and server
- **Validation**: Runtime type checking with Zod schemas
- **IDE Support**: Full TypeScript IntelliSense and error checking
- **Compile-Time Safety**: Catches type mismatches before runtime

### Request Logging Middleware
- **Performance Monitoring**: Request duration tracking
- **API Response Capture**: Logs response data for debugging
- **Selective Logging**: Only logs API routes to reduce noise
- **Log Truncation**: Prevents extremely long log messages

### Error Handling
- **Global Error Handler**: Catches all unhandled errors
- **Structured Responses**: Consistent error format across all endpoints
- **Status Code Mapping**: Appropriate HTTP status codes for different error types
- **Validation Errors**: Detailed field-level error messages from Zod

## File Organization

```
server/
├── index.ts          # Application entry point and server setup
├── routes.ts         # API endpoint definitions and request handling
├── storage.ts        # Database operations and business logic
├── db.ts            # Database connection and ORM configuration
├── vite.ts          # Development server and static file serving
└── readme.md        # This documentation file
```

## Environment Requirements

### Required Environment Variables
- **DATABASE_URL**: PostgreSQL connection string for Neon database
- **NODE_ENV**: Environment mode (development/production)
- **PORT**: Server port (defaults to 5000, required for Replit deployment)

### Development Dependencies
- **tsx**: TypeScript execution for development server
- **Drizzle Kit**: Database migration and schema management
- **Vite**: Frontend build tool integration for development

## Integration Points

### Client Integration
- **Shared Types**: Common TypeScript types via `@shared/schema`
- **API Contracts**: Consistent request/response interfaces
- **Development Server**: Vite proxy for seamless frontend/backend development

### Database Integration
- **Migration System**: Schema changes through Drizzle migrations
- **Type Generation**: Automatic type updates when schema changes
- **Connection Pooling**: Efficient database resource management

## Performance Considerations

### Database Optimization
- **Connection Pooling**: Reuses database connections for better performance
- **Query Optimization**: Proper indexing and ordering in database queries
- **Serverless Friendly**: Optimized for Neon's serverless PostgreSQL

### Request Processing
- **Middleware Efficiency**: Lightweight request processing pipeline
- **JSON Parsing**: Efficient body parsing with size limits
- **Error Handling**: Fast error responses without blocking other requests

## Security Features

### Input Validation
- **Zod Schemas**: Runtime validation of all incoming data
- **SQL Injection Prevention**: Parameterized queries through Drizzle ORM
- **Type Safety**: Compile-time prevention of type-related vulnerabilities

### Error Handling
- **Information Disclosure**: Generic error messages in production
- **Stack Trace Protection**: Detailed errors only in development
- **Status Code Consistency**: Proper HTTP status codes for security

This server implementation provides a robust, type-safe, and scalable foundation for the task management application, with clear separation of concerns and excellent developer experience.

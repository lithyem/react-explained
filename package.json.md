
# package.json

The `package.json` file is the configuration heart of this Node.js project. It defines the project metadata, dependencies, and build scripts for our full-stack task management application.

## Project Information

- **name**: `rest-express` - The project identifier
- **version**: `1.0.0` - Current version following semantic versioning
- **type**: `module` - Enables ES modules (import/export) instead of CommonJS
- **license**: `MIT` - Open source license

## Scripts

The application uses several npm scripts for different development and deployment phases:

### Development
- **`dev`**: Starts the development server with hot reload using tsx to run TypeScript directly
- **`check`**: Runs TypeScript type checking without compilation

### Production
- **`build`**: Creates production builds for both client and server
  - Uses Vite to build the React frontend into static files
  - Uses esbuild to bundle the Express server into a single executable
- **`start`**: Runs the compiled production server

### Database
- **`db:push`**: Applies database schema changes using Drizzle Kit

## Dependencies

### Production Dependencies
These packages are required for the application to run in production:

#### Frontend Framework & Libraries
- **react** & **react-dom**: Core React library for building the user interface
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolver for Zod schemas

#### UI Components & Styling
- **@radix-ui/** packages: Accessible headless UI components
- **tailwindcss-animate**: Animation utilities for Tailwind
- **tailwind-merge**: Utility for merging Tailwind classes
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

#### Backend & API
- **express**: Web framework for the API server
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store
- **passport** & **passport-local**: Authentication middleware

#### Database & Validation
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Automatic Zod schema generation from database schemas
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **zod**: Schema validation library

#### Development Enhancement
- **framer-motion**: Animation library for smooth UI transitions
- **next-themes**: Theme management for dark/light mode

### Development Dependencies
These packages are only needed during development and building:

#### Build Tools
- **vite**: Fast build tool and dev server for the frontend
- **esbuild**: Fast JavaScript bundler for the backend
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration and management tool

#### TypeScript & Types
- **typescript**: TypeScript compiler
- **@types/** packages: Type definitions for JavaScript libraries

#### Styling & Processing
- **tailwindcss**: Utility-first CSS framework
- **autoprefixer**: CSS vendor prefix automation
- **postcss**: CSS processing tool

#### Development Utilities
- **@replit/** packages: Replit-specific development tools for better integration

### Optional Dependencies
- **bufferutil**: Performance optimization for WebSocket connections (optional but recommended)

## Architecture Notes

This package.json is configured for a monorepo structure where:
- The client (React) and server (Express) share common dependencies
- TypeScript is used throughout for type safety
- The build process creates separate optimized bundles for frontend and backend
- Development tooling supports hot reload and type checking

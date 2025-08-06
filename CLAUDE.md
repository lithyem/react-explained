# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a full-stack task management application built with React, Express.js, and PostgreSQL. It demonstrates modern TypeScript development practices with shared type definitions across the entire stack.

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs Express server with tsx)
- `npm run build` - Build for production (builds Vite client + bundles server with esbuild)
- `npm run start` - Run production server
- `npm run check` - Run TypeScript type checking across entire codebase

### Database Operations
- `npm run db:push` - Push database schema changes using Drizzle Kit
- Database migrations are stored in `/drizzle/` directory

### Docker Commands
- `docker-compose --profile dev up -d` - Start development environment with PostgreSQL and app (runs on http://localhost:3000)
- `docker-compose --profile migrate up migrate` - Run database migrations in Docker
- `docker-compose --profile prod up` - Start production environment
- `docker-compose logs app-dev` - View application logs
- `docker-compose down` - Stop all services
- `docker-compose down -v` - Stop services and remove volumes (reset database)

### Railway Deployment
- Railway will automatically provision PostgreSQL database via `railway.json` plugins
- Uses production Dockerfile target with optimized build
- Environment variables needed: `DATABASE_URL` (auto-set), `NODE_ENV=production`, `PORT` (auto-set)
- Health check endpoint: `/api/tasks`
- Deploy command: Push to GitHub → Railway detects and builds automatically

## Architecture Overview

### Monorepo Structure
The project uses a monorepo architecture with three main directories:

- **`client/`** - React frontend with Vite build system
- **`server/`** - Express.js backend with TypeScript  
- **`shared/`** - Common types and schemas shared between client/server

### Key Architectural Patterns

**Type Safety Across Stack:**
- Shared TypeScript types defined in `shared/schema.ts`
- Drizzle ORM generates types from database schema
- Zod schemas validate API requests/responses
- All layers use the same type definitions

**Database Layer:**
- PostgreSQL with Drizzle ORM for type-safe queries
- Database connection configured in `server/db.ts`
- Schema definitions and migrations in `shared/schema.ts` and `drizzle/`
- Storage abstraction layer in `server/storage.ts`

**API Layer:**
- RESTful endpoints in `server/routes.ts`
- Request validation using Zod schemas
- Consistent error handling and JSON responses
- Proper HTTP status codes and error messages

**Frontend Architecture:**
- React 18 with TypeScript
- React Query for server state management and caching
- Wouter for lightweight client-side routing
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling

### Development Environment

**Path Aliases:**
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- Configured in both `tsconfig.json` and `vite.config.ts`

**Hot Reload Setup:**
- Vite provides HMR for React frontend
- tsx provides auto-restart for Express server
- Shared types are automatically available to both sides

### Important Files

**Core Configuration:**
- `tsconfig.json` - TypeScript config for entire monorepo
- `vite.config.ts` - Frontend build configuration
- `drizzle.config.ts` - Database schema management

**Entry Points:**
- `server/index.ts` - Express server entry point
- `client/src/main.tsx` - React application entry point
- `shared/schema.ts` - Shared type definitions and database schema

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 5000)

### Docker Setup
The application includes Docker configuration for local development:

**Services:**
- `postgres` - PostgreSQL 15 database with persistent volume
- `app-dev` - Development environment with hot reloading
- `app-prod` - Production environment with optimized build
- `migrate` - Database migration service

**Profiles:**
- `dev` - Development setup with source code mounting for hot reload
- `prod` - Production setup with built application
- `migrate` - Database migration runner

**Database Configuration:**
- Database: `taskflow`
- Username: `taskflow` 
- Password: `taskflow_dev_password`
- Port: `5432`
- Connection string: `postgresql://taskflow:taskflow_dev_password@postgres:5432/taskflow`

## Railway Deployment Guide

### Prerequisites
1. GitHub repository with the code
2. Railway account connected to GitHub

### Deployment Steps

**1. Configure Railway Files**
The following files are configured for Railway deployment:
- `railway.json` - Railway service configuration with PostgreSQL plugin
- `.railwayignore` - Files to exclude from Railway builds
- `Dockerfile` - Multi-stage production build

**2. Deploy to Railway**
```bash
# Commit and push to GitHub
git add .
git commit -m "Railway deployment configuration"
git push
```

**3. Create Railway Project**
1. Go to [Railway Dashboard](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically:
   - Create the application service
   - Provision PostgreSQL database (via plugins config)
   - Set up environment variables

**4. Environment Variables (Auto-configured)**
Railway automatically sets these variables:
- `DATABASE_URL` - PostgreSQL connection string from plugin
- `NODE_ENV` - Set to "production" 
- `PORT` - Railway-assigned port

**5. Database Migration**
After first deployment, run database migration:
```bash
# In Railway dashboard, go to your service
# Open the "Deploy" tab and run:
npm run db:push
```

**6. Access Your Application**
Your app will be available at: `https://your-service-name.railway.app`

### Railway-Specific Features

**Automatic Database Connection**
The database configuration in `server/db.ts` automatically detects Railway's Neon-style connection and uses the appropriate driver.

**Health Checks**
Railway monitors the `/api/tasks` endpoint to ensure the service is healthy.

**Cost Optimization**
- Uses standard PostgreSQL driver (no WebSocket overhead)
- Optimized Docker build with layer caching
- Production build excludes development dependencies

### Troubleshooting Railway Deployment

**Database Connection Issues:**
- Verify PostgreSQL plugin created successfully
- Check that `DATABASE_URL` environment variable is set
- Database takes 1-2 minutes to provision on first deploy

**Build Failures:**
- Check Railway build logs in dashboard
- Ensure all dependencies are in `package.json` (not just `package-lock.json`)
- Verify Dockerfile syntax and paths

**Application Won't Start:**
- Check that `PORT` environment variable is being used
- Verify the health check endpoint `/api/tasks` is accessible
- Review application logs in Railway dashboard

## Development Guidelines

### Database Changes
Always use Drizzle Kit for schema changes:
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Types are automatically regenerated

### API Development
- All routes in `server/routes.ts` include proper error handling
- Use Zod schemas from `shared/schema.ts` for validation
- Return consistent JSON responses with appropriate HTTP status codes

### Frontend Development
- Components use shadcn/ui patterns with Tailwind CSS
- Server state managed with React Query hooks
- Custom hooks stored in `client/src/hooks/`
- Page components in `client/src/pages/`

### Type Safety
- Always import types from `@shared/schema` when working with API data
- Use Drizzle-generated types for database operations
- Validate API inputs with Zod schemas before processing
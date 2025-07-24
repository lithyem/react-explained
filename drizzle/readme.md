
# Drizzle Database Migrations

This folder contains database migration files and related documentation for the task management application. Drizzle Kit uses this directory to manage database schema changes over time.

## What This Folder Contains

### Migration Files
- **SQL Migration Files**: Auto-generated SQL files that contain the actual database schema changes
- **File Naming Convention**: `XXXX_description.sql` where XXXX is a sequential number
- **Current Migrations**:
  - `0002_drop_users_table.sql` - Removes the users table from the database schema

## How Migrations Work

### Schema-First Approach
1. **Define Schema**: Changes are made in `shared/schema.ts` using Drizzle ORM syntax
2. **Generate Migration**: Run `npm run db:generate` to create SQL migration files
3. **Apply Migration**: Run `npm run db:migrate` to execute the SQL against the database

### Migration Process Flow
```
shared/schema.ts (TypeScript) 
    ↓ (drizzle-kit generate)
drizzle/XXXX_description.sql (SQL)
    ↓ (drizzle-kit push/migrate)
PostgreSQL Database (Applied Changes)
```

## Key Commands

### Development Workflow
```bash
# Generate new migration after schema changes
npm run db:generate

# Apply pending migrations to database
npm run db:migrate

# Push schema directly to database (development only)
npm run db:push

# View current database schema
npm run db:studio
```

### Migration Best Practices
- **Never edit migration files manually** - they are auto-generated
- **Always generate migrations** when changing `shared/schema.ts`
- **Test migrations** in development before applying to production
- **Backup database** before running migrations in production

## Configuration

The migration behavior is controlled by:
- **`drizzle.config.ts`**: Main configuration file
- **`DATABASE_URL`**: Environment variable for database connection
- **Output Directory**: This folder (`./drizzle`) stores all migration files

## Migration History

### 0002_drop_users_table.sql
- **Purpose**: Removes the users table from the database
- **Reason**: Simplified the application to focus only on task management
- **Impact**: Authentication features removed, app now works without user accounts

## Database Schema Evolution

The application has evolved from:
1. **Initial Schema**: Tasks + Users tables for multi-user functionality
2. **Current Schema**: Tasks-only for simplified single-user experience

## Troubleshooting

### Common Issues
- **Missing DATABASE_URL**: Ensure environment variable is set
- **Schema Drift**: Use `drizzle-kit push` to sync development database
- **Migration Conflicts**: Regenerate migrations if manual database changes were made

### Recovery Steps
If migrations fail:
1. Check database connection
2. Verify migration file syntax
3. Restore from backup if necessary
4. Regenerate migrations from current schema

## Integration with Application

This migration system ensures:
- **Type Safety**: Schema changes automatically update TypeScript types
- **Version Control**: All schema changes are tracked in Git
- **Deployment**: Migrations run automatically during application deployment
- **Consistency**: Same schema across development, staging, and production

The migration files in this folder are the source of truth for database structure and must be preserved in version control.

# Multi-stage Dockerfile for TaskFlow application
# Optimized for both development and production builds

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development dependencies
FROM base AS dev-deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies including dev dependencies
RUN npm ci && npm cache clean --force

# Build the application
FROM dev-deps AS builder
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 taskflow

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./

# Change ownership to non-root user
RUN chown -R taskflow:nodejs /app
USER taskflow

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/tasks', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]

# Development image
FROM dev-deps AS development
WORKDIR /app

# Copy source code
COPY . .

# Expose port for development
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
# Multi-stage build for the new monorepo structure
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and lockfiles
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci

# Frontend build stage
FROM base AS frontend-builder
WORKDIR /app

# Copy frontend source and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules
COPY packages/frontend/ ./packages/frontend/
COPY package*.json ./

# Build frontend
RUN npm run build:frontend

# Backend build stage
FROM base AS backend-builder
WORKDIR /app

# Copy backend source and dependencies
COPY --from=deps /app/node_modules ./node_modules  
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
COPY packages/backend/ ./packages/backend/
COPY package*.json ./

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built backend application
COPY --from=backend-builder --chown=nodejs:nodejs /app/packages/backend ./

# Copy built frontend assets (for serving static files if needed)
COPY --from=frontend-builder --chown=nodejs:nodejs /app/packages/frontend/dist ./public

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/app.js"] 

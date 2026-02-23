# Multi-stage build for nuxt-app in monorepo

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /build

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/nuxt-app/package.json ./apps/nuxt-app/
COPY packages/ ./packages/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build nuxt-app
RUN pnpm build:nuxt

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Install pnpm (for production dependencies if needed)
RUN npm install -g pnpm@9.15.4

# Copy package files for production dependencies
COPY --from=builder /build/package.json /build/pnpm-lock.yaml /build/pnpm-workspace.yaml ./
COPY --from=builder /build/apps/nuxt-app/package.json ./apps/nuxt-app/
COPY --from=builder /build/packages ./packages

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built output from builder
COPY --from=builder /build/apps/nuxt-app/.output ./apps/nuxt-app/.output

# Copy start script from local (not from builder)
COPY apps/nuxt-app/start.sh ./apps/nuxt-app/
RUN chmod +x ./apps/nuxt-app/start.sh

# Set working directory to nuxt-app
WORKDIR /app/apps/nuxt-app

# Expose port (Zeabur will set PORT env var)
EXPOSE 3000
ENV PORT=3000

# Start Nuxt server with debug script
# Temporary: Test if container can run at all
CMD ["sh", "-c", "echo '=== Container Started ===' && sleep 60 && echo 'Still alive' && exec sh start.sh"]

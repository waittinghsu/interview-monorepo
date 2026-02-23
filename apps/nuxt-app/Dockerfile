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

# Copy built output from builder
COPY --from=builder /build/apps/nuxt-app/.output ./.output

# Expose port (Zeabur will set PORT env var)
EXPOSE 3000
ENV PORT=3000

# Start Nuxt server
CMD ["node", ".output/server/index.mjs"]

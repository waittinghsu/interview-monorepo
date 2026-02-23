# Dockerfile for nuxt-app in monorepo
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/nuxt-app/package.json ./apps/nuxt-app/
COPY packages/shared-api/package.json ./packages/shared-api/
COPY packages/shared-design-tokens/package.json ./packages/shared-design-tokens/
COPY packages/shared-mocks/package.json ./packages/shared-mocks/
COPY packages/shared-utils/package.json ./packages/shared-utils/

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Install dependencies
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build nuxt-app
RUN pnpm build:nuxt

# Expose port
EXPOSE 3000

# Start command
WORKDIR /app/apps/nuxt-app
CMD ["node", ".output/server/index.mjs"]

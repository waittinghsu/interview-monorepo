FROM node:22-slim AS builder
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm@9 --force

# Copy workspace manifests first (layer cache)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/nuxt-app/package.json ./apps/nuxt-app/
COPY apps/smartauto-nuxt-app/package.json ./apps/smartauto-nuxt-app/
COPY apps/vue-app/package.json ./apps/vue-app/
COPY apps/api-server/package.json ./apps/api-server/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full source
COPY . .

# Build nuxt-app (SSR)
RUN pnpm --filter=@interview/nuxt-app build

# ---- Production stage ----
FROM node:22-slim
WORKDIR /src

COPY --from=builder /src/apps/nuxt-app/.output ./apps/nuxt-app/.output

# PORT is injected by Zeabur (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["/bin/sh", "-c", "node apps/nuxt-app/.output/server/index.mjs 2>&1"]

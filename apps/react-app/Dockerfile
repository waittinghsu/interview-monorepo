# ════════════════════════════════════════════════════════
# K-Pop Hub — react-app Dockerfile
# Multi-stage build for Monorepo (pnpm workspace)
# Build context: monorepo root (Zeabur 預設從根目錄 build)
# ════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────
# Stage 1: Builder
# 負責安裝依賴 + 執行 Vite build
# 使用 node:22-slim（比 full 版小很多，去除非必要工具）
# ──────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# 安裝 pnpm（版本與 packageManager 欄位對齊）
# --force 避免 corepack 版本衝突問題
RUN npm install -g pnpm@9 --force

# ── 複製 workspace 設定檔（先複製這些，利用 Docker layer cache）
# 只要這些檔案不變，後續 pnpm install 就能直接用快取
# 這是 monorepo Dockerfile 的關鍵優化技巧
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# ── 複製所有 apps/packages 的 package.json（供 pnpm 解析 workspace 依賴）
# pnpm 需要知道整個 workspace 的結構才能正確安裝
COPY apps/react-app/package.json ./apps/react-app/

# ── 安裝依賴（只安裝 react-app 需要的部分）
# --filter=@interview/react-app... 中的 ... 表示「含所有 workspace 依賴」
# 這樣比 pnpm install（全裝）快很多，image 也更小
RUN pnpm install --filter=@interview/react-app... --frozen-lockfile

# ── 複製源碼（在安裝依賴之後，利用快取）
# 如果只改了 src/ 的程式碼，可以跳過重新安裝依賴
COPY apps/react-app/ ./apps/react-app/

# ── 執行 Vite build
# 產生靜態檔案到 apps/react-app/dist/
RUN pnpm --filter=@interview/react-app build

# ──────────────────────────────────────────────────────
# Stage 2: Production
# 只保留 nginx + 靜態檔案，丟掉所有 node_modules 和源碼
# nginx:alpine 只有約 40MB（比 node:22-slim 的 200MB+ 小很多）
# ──────────────────────────────────────────────────────
FROM nginx:alpine AS production

# 複製 builder stage 產生的靜態檔案到 nginx 服務目錄
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html

# 複製 nginx 設定（SPA routing 支援）
# 此設定會覆蓋 nginx:alpine 的預設設定
COPY apps/react-app/nginx.conf /etc/nginx/conf.d/default.conf

# nginx 預設監聽 80 port（Zeabur 會自動對應到外部 port）
EXPOSE 80

# nginx:alpine 的預設 CMD 已啟動 nginx，無需額外設定
# CMD ["nginx", "-g", "daemon off;"]  <- 這是 nginx:alpine 的預設，不需要重複

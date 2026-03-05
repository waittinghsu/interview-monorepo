# api-server

Fastify v5 + Prisma + TypeScript RESTful API 伺服器，提供會員、書籍、遊戲、演唱會、股票等資源的 CRUD 介面。

## 技術棧

- **框架**：Fastify v5（ESM）
- **ORM**：Prisma（PostgreSQL）
- **認證**：JWT（`@fastify/jwt`）
- **API 文件**：Swagger UI（`@fastify/swagger-ui`）
- **語言**：TypeScript（ESM，`"type": "module"`）
- **測試**：Vitest（整合測試）

## 本地開發

### 前置需求

- Node.js 22+
- PostgreSQL（本地資料庫名稱：`interview_db`）
- pnpm

### 啟動步驟

```bash
# 1. 進入目錄
cd apps/api-server

# 2. 建立 .env（參考下方環境變數說明）
cp .env.example .env  # 若無範例檔，手動建立

# 3. 執行資料庫遷移
pnpm db:migrate:dev

# 4. 執行 Seed 資料
pnpm db:seed

# 5. 啟動開發伺服器
pnpm dev
```

API 伺服器啟動後可在 http://localhost:3001 訪問。

Swagger UI 文件：http://localhost:3001/docs

### 環境變數（`.env`）

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/interview_db
JWT_SECRET=your-local-jwt-secret
PORT=3001
```

## 建置

```bash
# 編譯 TypeScript
pnpm build

# 或直接啟動（不需先 build）
pnpm dev
```

## 測試

```bash
# 執行所有測試（50 個測試案例）
pnpm test

# 監視模式
pnpm test:watch

# 產生 HTML 測試報告
npx vitest run --reporter=html
npx vite preview --outDir html --port 7777
```

### 測試覆蓋範圍

| 測試模組 | 測試數 | 說明 |
|---------|--------|------|
| Concert Routes | 11 | 演唱會 CRUD + 認證 |
| Game Routes | 13 | 遊戲 CRUD + 認證 |
| Book Routes | 12 | 書籍 CRUD + 認證 |
| MemberLevel Routes | 10 | 會員等級 CRUD + 認證 |
| Stock Routes | 4 | Yahoo Finance 代理 |
| **合計** | **50** | **100% 通過** |

## API 路由總覽

| 方法 | 路徑 | 說明 | 認證 |
|------|------|------|------|
| POST | `/v1/api/user/login` | 登入 | - |
| GET | `/v1/api/user/info` | 取得會員資訊 | ✅ |
| GET | `/v1/api/games` | 遊戲列表 | - |
| GET/PUT/DELETE | `/v1/api/games/:gameId` | 遊戲詳情/更新/刪除 | PUT/DELETE ✅ |
| GET | `/v1/api/books` | 書籍列表 | - |
| GET/PUT/DELETE | `/v1/api/books/:bookId` | 書籍詳情/更新/刪除 | PUT/DELETE ✅ |
| GET | `/v1/api/member-levels` | 會員等級列表 | - |
| GET/PUT/DELETE | `/v1/api/member-levels/:levelId` | 等級詳情/更新/刪除 | PUT/DELETE ✅ |
| GET | `/v1/api/concerts` | 演唱會列表 | - |
| GET/PUT/DELETE | `/v1/api/concerts/:concertId` | 演唱會詳情/更新/刪除 | PUT/DELETE ✅ |
| GET | `/v1/api/stock/:symbol` | 股票資訊（Yahoo Finance 代理） | - |

完整 Swagger 規格：`docs/swaggerApi-side-project.json`

## 資料庫

### Schema（Prisma）

- `User`：使用者（email/password/JWT 認證）
- `Game`：遊戲（CUID 主鍵，支援 genre/platform/tags 篩選）
- `Book`：書籍（CUID 主鍵，支援 genre/keyword/inStock 篩選）
- `MemberLevel`：會員等級（整數主鍵 levelId，discount 為 Decimal）
- `Concert`：演唱會（venue/tickets 為 JSON 欄位）

### 常用指令

```bash
pnpm db:migrate:dev   # 建立新遷移（開發用）
pnpm db:migrate       # 套用遷移（生產用）
pnpm db:seed          # 填入 Seed 資料
pnpm db:generate      # 重新產生 Prisma Client
```

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| **Project** | backend-server (`69a71bbde10515e35593d5ef`) |
| **Service ID** | `69a721f0e10515e35593d7bb` |
| **觸發分支** | `dev` |
| **ZBPACK_ROOT_DIRECTORY** | `apps/api-server` |
| **PostgreSQL Service** | `69a720b3ebec607bb566eb3f` |

### zbpack.json（`apps/api-server/zbpack.json`）

```json
{
  "build_command": "npx prisma generate && npx tsc",
  "start_command": "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/index.js"
}
```

> **注意**：Zeabur builder 會自動執行 `yarn install` 安裝所有依賴，build_command 只需負責產生 Prisma Client 和編譯 TypeScript。

### 部署流程

1. 推送到 `dev` 分支自動觸發部署
2. Zeabur builder 在 `apps/api-server/` 目錄執行 `yarn install`
3. 執行 `npx prisma generate && npx tsc` 產生 Prisma Client 並編譯 TypeScript
4. 啟動時執行 `npx prisma migrate deploy`（套用資料庫遷移）
5. 執行 `npx tsx prisma/seed.ts`（填入初始資料）
6. 啟動 `node dist/index.js`

### 生產環境變數

| 變數名稱 | 說明 |
|---------|------|
| `DATABASE_URL` | PostgreSQL 連線字串（Zeabur 自動從 DB service 注入） |
| `JWT_SECRET` | JWT 簽名密鑰 |
| `PORT` | 伺服器 port（Zeabur 自動注入，預設 8080） |

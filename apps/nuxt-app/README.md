# nuxt-app

Nuxt 3 SSR 前端應用，提供更完整的使用者功能，包含會員系統、書籤、等級等功能。

## 技術棧

- **框架**：Nuxt 3（SSR 模式）
- **CSS 框架**：UnoCSS
- **UI 元件庫**：Quasar（部分元件）
- **狀態管理**：Pinia
- **資料層**：TanStack Query + Axios / Nuxt $fetch
- **驗證**：Zod
- **語言**：TypeScript（嚴格模式）
- **API 架構**：DDD（`features/`） + Services + Composables（`services/` + `composables/api/`）

## 本地開發

```bash
# 從 monorepo 根目錄執行
pnpm dev:nuxt

# 或進入 apps/nuxt-app 執行
pnpm dev
```

應用啟動後可在 http://localhost:30678 訪問。

## 建置

```bash
# 從 monorepo 根目錄
pnpm build:nuxt

# 建置輸出在 apps/nuxt-app/.output/
```

## Lint

```bash
cd apps/nuxt-app
npx eslint --fix .
```

## 目錄結構

```
apps/nuxt-app/
├── pages/            # Nuxt 自動路由（kebab-case 命名）
├── layouts/          # 版面配置（default.vue）
├── stores/           # Pinia stores（TypeScript）
├── composables/
│   └── api/          # API composables（Axios + TanStack Query）
├── features/         # Domain-Driven Design 結構
│   └── user/
│       ├── types/    # TypeScript 型別
│       ├── schemas/  # Zod schemas（本地定義）
│       ├── services/ # API services（Nuxt $fetch）
│       ├── queries/  # TanStack Query hooks
│       └── index.ts
├── services/         # 業務 service 層（Axios）
│   ├── user.ts
│   └── stock.ts
└── components/
    └── common/       # 共用元件
```

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| **Project** | yapi-omega (`6982c352660671a403f1e1d2`) |
| **Service ID** | `699c39b846fe0965fb048116` |
| **觸發分支** | `dev` |
| **ZBPACK_ROOT_DIRECTORY** | 未設定（建議設為 `apps/nuxt-app`） |
| **類型** | Node.js SSR |

### zbpack.json

每個 app 目錄下皆有獨立 `zbpack.json`，目前 Zeabur 使用 **repo 根目錄** 的 `zbpack.json`：

```json
{
  "build_command": "pnpm --filter=@interview/nuxt-app build",
  "start_command": "cd /src && node apps/nuxt-app/.output/server/index.mjs"
}
```

`apps/nuxt-app/zbpack.json` 也已建立，若將 Zeabur 的 `ZBPACK_ROOT_DIRECTORY` 改為 `apps/nuxt-app` 即可使用：

```json
{
  "build_command": "pnpm --filter=@interview/nuxt-app build",
  "start_command": "node /src/apps/nuxt-app/.output/server/index.mjs"
}
```

### 部署流程

1. 推送到 `dev` 分支自動觸發部署
2. Zeabur 安裝 monorepo 依賴（`pnpm install --ignore-scripts`）
3. 執行 `pnpm --filter=@interview/nuxt-app build`
4. 啟動 SSR 伺服器：`node apps/nuxt-app/.output/server/index.mjs`

## 環境變數

| 變數名稱 | 說明 |
|---------|------|
| `PORT` | 伺服器監聽 port（Zeabur 自動注入） |

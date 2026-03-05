# vue-app

Vue 3 + Vite 前端 SPA，作為專案展示與面試練習用的前端應用。

## 技術棧

- **框架**：Vue 3 (Composition API)
- **建置工具**：Vite
- **UI 元件庫**：Quasar
- **CSS 框架**：UnoCSS
- **狀態管理**：Pinia
- **HTTP Client**：Axios（來自 shared-api）
- **語言**：JavaScript（非 TypeScript）

## 本地開發

```bash
# 從 monorepo 根目錄執行
pnpm dev:vue

# 或進入 apps/vue-app 執行
pnpm dev
```

應用啟動後可在 http://localhost:9527 訪問。

## 建置

```bash
# 從 monorepo 根目錄
pnpm build:vue

# 建置輸出在 apps/vue-app/dist/
```

## Lint

```bash
cd apps/vue-app
npx eslint --fix src/
```

## 目錄結構

```
src/
├── pages/            # 頁面元件（對應路由）
├── components/
│   └── common/       # 共用元件
├── stores/           # Pinia stores
├── composables/      # 可重用邏輯
├── api/
│   ├── index.js      # httpClient 實例
│   ├── loading.js    # loading bus
│   └── services/     # API services
│       ├── user.js
│       └── stock.js
└── router/
    └── index.js      # 路由設定
```

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| **Project** | yapi-omega (`6982c352660671a403f1e1d2`) |
| **Service ID** | `698d9d03eceac33904f65b78` |
| **觸發分支** | `main` |
| **ZBPACK_ROOT_DIRECTORY** | `apps/vue-app` |
| **類型** | 靜態網站（Caddy 伺服器） |

### zbpack.json

```json
{
  "build_command": "pnpm --filter=@interview/vue-app build",
  "output_dir": "apps/vue-app/dist"
}
```

### 部署流程

1. 推送到 `main` 分支自動觸發部署
2. Zeabur 安裝 monorepo 依賴（`pnpm install --ignore-scripts`）
3. 執行 `pnpm --filter=@interview/vue-app build`
4. 靜態檔案從 `apps/vue-app/dist/` 由 Caddy 伺服器提供服務

> 注意：`main` 分支為正式部署分支，所有功能開發請先在 `dev` 分支完成，再 merge 到 `main`。

## 環境變數

無需額外環境變數，API 端點在程式碼中配置。

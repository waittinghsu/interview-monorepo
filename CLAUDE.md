# CLAUDE.md — Interview Monorepo

## 專案概覽

pnpm + Turborepo monorepo，包含兩個前端 App 與共用套件。

| App | 框架 | Port | 類型 |
|-----|------|------|------|
| `apps/vue-app` | Vue 3 + Vite | 9527 | SPA |
| `apps/nuxt-app` | Nuxt 3 | 30678 | SSR |

共用套件：`packages/shared-design-tokens`（三主題 + 型別定義）

---

## Shared Packages 設計原則

### `packages/shared-api`

**只包含通用工具**，不包含業務邏輯：

✅ **應該有的**：
- `createHttpClient` - HTTP client 工廠函數
- `createRequestInterceptor` / `createResponseInterceptor` - 攔截器

❌ **不應該有的**：
- ~~`createUserService`~~ - 業務 service（URL、端點定義）
- ~~`createStockService`~~ - 各 app 的後端結構不同
- ~~Zod schemas~~ - 各 app 的資料結構不同，應在本地定義

**原因**：不同 app 可能有完全不同的 API 結構與資料格式
- vue-app: `/v1/api/user/login`（返回 `{ id, name, email, avatar }`）
- nuxt-app: `/api/userinfo`（返回 `{ memberId, name, nickname, phone, email, balance, level, avatarId, bookmarks }`）
- other-app: `/users/authenticate`（結構完全不同）

**實作方式**：
- **vue-app**：在 `src/api/services/` 定義業務 service
- **nuxt-app**：在 `features/{domain}/schemas/` 定義 Zod schemas，在 `features/{domain}/services/` 或 `services/` 定義業務 service

### `packages/shared-design-tokens`

**只包含設計 token**，不包含組件實作：
- 顏色變數、主題定義
- 型別定義（TypeScript）

---

## 常用指令

```bash
# 開發
pnpm dev:vue        # 只啟動 vue-app
pnpm dev:nuxt       # 只啟動 nuxt-app
pnpm dev            # 全部啟動

# 建置
pnpm build

# Lint（必須在 commit 前通過）
pnpm lint
```

---

## Git 工作流程

- **開發分支**：`dev`（所有新功能都在這裡）
- **主分支**：`main`（Zeabur 自動部署，merge 後才部署）
- **禁止** force push 到 main

```bash
git pull origin dev          # 開始前先拉最新
# ... 開發 ...
git add <具體檔案>            # 不要用 git add -A
git commit -m "feat: xxx"
git push origin dev
```

### Commit 規範（Conventional Commits）

```
feat:     新功能
fix:      修 bug
chore:    套件、設定調整
refactor: 重構（無功能變更）
style:    純樣式調整
docs:     文件
test:     測試
```

---

## 設計 Token 系統

所有顏色透過 CSS 變數動態套用，**不要** hardcode 顏色值。

### 可用的 UnoCSS class（對應 CSS 變數）

```
# 背景
bg-sys-page          # 頁面底色
bg-sys-card          # 卡片背景
bg-sys-raised        # 浮起元素背景

# 邊框
border-sys-border
border-sys-border-strong

# 文字
text-textBase        # 主要文字
text-textSecondary   # 次要文字
text-textMuted       # 淡色文字
text-textBrand       # 品牌色文字
text-textInverse     # 反色文字

# 主題色
text-primary         # = action color
bg-primary
text-secondary
bg-secondary
```

### 漸層按鈕 Shortcut（vue-app）

```html
<q-btn unelevated class="btn-gradient-primary" />   <!-- action → secondary，主色漸層 -->
<q-btn unelevated class="btn-gradient-success" />   <!-- successLight → successDark -->
<q-btn unelevated class="btn-gradient-warning" />   <!-- warningLight → warningDark -->
<q-btn unelevated class="btn-gradient-error" />     <!-- errorLight → errorDark -->
<q-btn unelevated class="btn-gradient-info" />      <!-- infoLight → infoDark -->
```

### 禁止使用的舊 token 名稱

```
❌ bg-sys-background   → ✅ bg-sys-page
❌ bg-sys-surface      → ✅ bg-sys-card
❌ text-textPrimary    → ✅ text-textBase
❌ text-primary-xxx（直接寫顏色）
```

---

## vue-app 開發規範

### 結構

```
src/
├── pages/          # 頁面元件（對應 router）
├── components/common/  # 共用元件
├── stores/         # Pinia stores（.js）
├── composables/    # 可重用邏輯
├── api/
│   ├── index.js        # httpClient 實例、callbacks 配置
│   ├── loading.js      # loadingBus（純 JS）
│   └── services/       # API services（本地定義，不在 shared-api）
│       ├── user.js     # createUserService
│       └── stock.js    # createStockService
└── router/index.js # 路由設定
```

**重要**：API services 在各 app 本地定義，不放在 shared-api
- `shared-api` 只提供通用的 `createHttpClient` 和攔截器
- 各 app 根據自己的後端 API 結構定義 service

### 新增頁面步驟

1. 建立 `src/pages/XxxPage.vue`
2. 在 `src/router/index.js` 加入路由（lazy import）
3. 在 `src/pages/HomePage.vue` 的 `actionButtons` 和 `gridItems` 加入入口

### 語言：JavaScript（非 TypeScript）

```vue
<script setup>
// 使用 auto-import：ref, computed, onMounted, useRouter, useRoute
// Pinia stores：useThemeStore, useUserStore
const router = useRouter()
</script>
```

### 樣式規則

- 使用 UnoCSS utility class，不要寫 scoped CSS（除非動畫）
- 顏色一律用設計 token class（見上方）
- 捲軸隱藏：`scrollbar-hide`（presetUno 內建）
- Quasar 元件搭配設計 token：`q-menu` 加 `class="bg-sys-card"`

### API 調用規則

**重要**：攔截器會自動解包 `response.data`，所以：

```javascript
// ❌ 錯誤（多了一層 .data）
const response = await userApi.login(credentials)
const token = response.data.token  // undefined！

// ✅ 正確（攔截器已經返回 data 了）
const response = await userApi.login(credentials)
const token = response.token  // ✓
```

**Business Response Format（httpClient）**：
```javascript
// 後端回傳：{ code: '200', msg: 'OK', data: { token, user } }
// 攔截器解包後：{ token, user }
const data = await userApi.login(credentials)
```

**外部 API（externalHttpClient）**：
```javascript
// 外部 API 回傳：{ chart: { result: [...] } }
// 攔截器不解包（responseFormat.enabled = false）
const response = await stockApi.get0050(params)
const result = response.chart.result[0]  // 直接訪問
```

**Per-request 選項**：
```javascript
// 跳過 loading、靜默錯誤、原始回應
await userApi.login(credentials, {
  skipLoading: true,   // 不顯示 loading bar
  silentError: true,   // 錯誤不觸發 callback
  rawResponse: true,   // 回傳完整 { code, msg, data }
})
```

---

## nuxt-app 開發規範

### 結構

```
pages/          # Nuxt 自動路由（.vue）
layouts/        # default.vue
stores/         # Pinia（.ts，TypeScript）
composables/    # useXxx.ts
  api/          # API composables（使用 services/ 層，Axios + TanStack Query）
features/       # Domain-driven design（建議用於新功能）
  user/
    types/      # TypeScript 型別
    schemas/    # Zod schemas（本地定義，不在 shared-api）
    services/   # API services（使用 Nuxt $fetch）
    queries/    # TanStack Query hooks
    index.ts    # 統一導出
services/       # 業務 service 層（使用 Axios，搭配 composables/api/）
  user.ts       # createUserService（返回 Axios instance methods）
  stock.ts      # createStockService
components/common/
```

### API 架構說明

**nuxt-app 有兩種 API 架構並存**：

1. **Domain-Driven Design (DDD)** - `features/{domain}/`
   - 適用：新功能、複雜業務領域
   - 優點：高內聚、易維護、完整的型別安全
   - HTTP Client：Nuxt `$fetch` / `useApiClient()`
   - 範例：`features/user/`
   ```typescript
   // 使用方式
   import { useUserService, useUserInfoQuery } from '~/features/user'
   const { getUserInfo } = useUserService()
   const { data } = useUserInfoQuery()
   ```

2. **Services + Composables** - `services/` + `composables/api/`
   - 適用：外部 API、簡單資料獲取
   - HTTP Client：Axios（來自 shared-api 的 `createHttpClient`）
   - 範例：`services/stock.ts` + `composables/api/useStock.ts`
   ```typescript
   // 使用方式
   import { useStockChartQuery } from '~/composables/api/useStock'
   const { data } = useStockChartQuery('0050.TW')
   ```

**重要規則**：
- ❌ **禁止**在 `packages/shared-api` 定義業務 service 或 schemas
- ✅ Schemas 定義在 `features/{domain}/schemas/`，不要建立根目錄 `schemas/`
- ✅ 新功能優先使用 DDD 結構（`features/`）
- ✅ 兩種架構可共存，根據需求選擇

### 語言：TypeScript（嚴格模式）

```vue
<script setup lang="ts">
// 所有 Nuxt auto-imports 可直接用
// ref, computed, useState, useRoute, useRouter
// definePageMeta, useFetch, useAsyncData
</script>
```

### 新增頁面步驟

1. 建立 `pages/xxx.vue`（kebab-case 檔名）
2. 加上 `definePageMeta({ layout: 'default', title: '...' })`
3. Nuxt 自動產生路由，不需手動設定

### ESLint 重要規則（nuxt-app）

```typescript
// ✅ Array 泛型明確指定
Array.from<number>({ length: 10 }).fill(0)

// ✅ QInput onChange 型別
function handleInput(value: string | number | null) {
  const str = String(value ?? '')
}

// ✅ Pinia store rules 型別
rules?: Array<[string, string | Record<string, string>] | [RegExp, Function]>
```

---

## ESLint 規範（兩個 App 共用）

- 設定：`@antfu/eslint-config`
- **必須** 在 push 前通過 `pnpm lint`
- 縮排：2 spaces
- 引號：single quote
- 無分號
- `no-console`：vue-app 警告，nuxt-app 允許

```bash
# 自動修復
cd apps/vue-app && npx eslint --fix src/
cd apps/nuxt-app && npx eslint --fix .
```

---

## 設計 Token 修改流程

若要修改主題顏色：

1. 編輯 `packages/shared-design-tokens/src/themes/<theme>.js`
2. 不要動 `types.js` 的結構（除非要加新 token）
3. 三個主題都要同步更新同名 token
4. 修改後重啟 dev server（vite 會重新載入）

---

## 注意事項

- `pnpm-lock.yaml` 由 pnpm 自動管理，不要手動編輯
- `src/auto-imports.d.ts`、`src/components.d.ts` 是自動產生的，不要編輯
- `.nuxt/` 和 `dist/` 不要 commit
- Quasar 元件（`q-*`）已全域註冊，不需 import
- UnoCSS class 若無效果，先確認 token 名稱是否用新版（見上方禁止清單）

---

## Multi-Agent 架構

### Agent 清單

| Agent | 檔案 | 職責 |
|-------|------|------|
| 研究員 | `.claude/agents/researcher.md` | 需求分析、Figma 調查、產出 plan.json |
| 執行者 | `.claude/agents/executor.md` | 依 plan.json 執行程式碼修改 |
| API Agent | `.claude/agents/api-agent.md` | 讀 Swagger、產生 API functions、維護 api-spec.md |

### App Context 規範速查

| 檔案 | 對應 App |
|------|---------|
| `.claude/context/vue-app.md` | Vue 3 + Vite SPA（JavaScript） |
| `.claude/context/nuxt-app.md` | Nuxt 3 SSR（TypeScript 嚴格模式） |

**所有 agent 開始工作前，必須先確認 `target_app` 並讀取對應 context。**

### Context 流向

```
Swagger ──→ API Agent ──→ shared/api-spec.md
                                   │
Figma ──→ 研究員 ──→ shared/plan.json ──→ 執行者
           │  (含 target_app)              │
           ↑                               ↓
  .claude/context/{app}.md ←── 兩者都需讀取
```

### 日常模式（預設，循序執行）

```
API Agent（若需要更新）→ 研究員 → 你確認 → 執行者
```

每個階段完成後**暫停回報**，等待確認後才繼續。

### 高強度模式

使用者說「**高強度模式**」觸發。API Agent、研究員、前置調查**平行跑**，產出計畫書後你確認，再呼叫執行者。

### 通用規則（所有 Agent 遵守）

- **修改任何檔案前**：說明影響範圍
- **計畫書未涵蓋的情況**：停下來問，不自行判斷
- **每階段完成後**：暫停回報，不一次跑完
- **禁止修改**：`nuxt.config.ts` / `quasar.config.ts` / `uno.config.ts` / `capacitor.config.ts`

### 共用檔案路徑

| 檔案 | 用途 |
|------|------|
| `shared/plan.json` | 當前任務計畫書（執行者必讀） |
| `shared/plans/{日期}_{任務}.json` | 計畫書備份 |
| `shared/api-spec.md` | API function 規格（研究員與執行者參考） |
| `shared/research.md` | 研究員的調查中間產物 |

### 呼叫 Agent 的方式

```
# 呼叫研究員
Task: researcher — {任務描述}

# 呼叫執行者（研究員完成並確認後）
Task: executor — 依照 shared/plan.json 執行

# 呼叫 API Agent
Task: api-agent — 更新 API spec（Swagger URL: {url}）
```

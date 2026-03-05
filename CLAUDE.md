# CLAUDE.md — Interview Monorepo

## 專案概覽

pnpm + Turborepo monorepo，包含兩個前端 App、一個 API Server 與共用套件。

| App | 框架 | Port | 類型 | 觸發分支 |
|-----|------|------|------|---------|
| `apps/vue-app` | Vue 3 + Vite | 9527 | SPA | `main` |
| `apps/nuxt-app` | Nuxt 3 | 30678 | SSR | `dev` |
| `apps/api-server` | Fastify v5 | 3001 | API | `dev` |

共用套件：`packages/shared-design-tokens`（三主題 + 型別定義）

---

## 各 App 詳細規範

各 app 的開發規範放在各自目錄的 CLAUDE.md：

@apps/vue-app/CLAUDE.md

@apps/nuxt-app/CLAUDE.md

@apps/api-server/CLAUDE.md

---

## Shared Packages 設計原則

### `packages/shared-api`

**只包含通用工具**，不包含業務邏輯：

✅ **應該有的**：
- `createHttpClient` - HTTP client 工廠函數
- `createRequestInterceptor` / `createResponseInterceptor` - 攔截器

❌ **不應該有的**：
- ~~`createUserService`~~ - 業務 service（URL、端點定義）
- ~~Zod schemas~~ - 各 app 的資料結構不同，應在本地定義

**原因**：不同 app 有完全不同的 API 結構：
- vue-app: `/v1/api/user/login` → `{ id, name, email, avatar }`
- nuxt-app: `/api/userinfo` → `{ memberId, name, nickname, ... }`

### `packages/shared-design-tokens`

**只包含設計 token**，不包含組件實作：顏色變數、主題定義、型別定義（TypeScript）

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
git pull origin dev
# ... 開發 ...
git add <具體檔案>   # 不要用 git add -A
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

### 可用的 UnoCSS class

```
bg-sys-page          # 頁面底色
bg-sys-card          # 卡片背景
bg-sys-raised        # 浮起元素背景
border-sys-border
border-sys-border-strong
text-textBase        # 主要文字
text-textSecondary   # 次要文字
text-textMuted       # 淡色文字
text-textBrand       # 品牌色文字
text-textInverse     # 反色文字
text-primary / bg-primary
text-secondary / bg-secondary
```

### 禁止使用的舊 token 名稱

```
❌ bg-sys-background   → ✅ bg-sys-page
❌ bg-sys-surface      → ✅ bg-sys-card
❌ text-textPrimary    → ✅ text-textBase
```

### 修改 Token 流程

1. 編輯 `packages/shared-design-tokens/src/themes/<theme>.js`
2. 三個主題都要同步更新同名 token
3. 修改後重啟 dev server

---

## ESLint 規範（共用）

- 設定：`@antfu/eslint-config`
- **必須** 在 push 前通過 `pnpm lint`
- 縮排：2 spaces｜引號：single quote｜無分號
- `no-console`：vue-app 警告，nuxt-app 允許（各 app CLAUDE.md 有說明）

---

## 注意事項

- `pnpm-lock.yaml` 由 pnpm 自動管理，不要手動編輯
- `src/auto-imports.d.ts`、`src/components.d.ts` 是自動產生的，不要編輯
- `.nuxt/` 和 `dist/` 不要 commit
- Quasar 元件（`q-*`）已全域註冊，不需 import

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

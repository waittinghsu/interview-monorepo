# CLAUDE.md — Interview Monorepo

## 專案概覽

pnpm + Turborepo monorepo，包含兩個前端 App 與共用套件。

| App | 框架 | Port | 類型 |
|-----|------|------|------|
| `apps/vue-app` | Vue 3 + Vite | 9527 | SPA |
| `apps/nuxt-app` | Nuxt 3 | 30678 | SSR |

共用套件：`packages/shared-design-tokens`（三主題 + 型別定義）

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
├── api/            # API 呼叫
└── router/index.js # 路由設定
```

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

---

## nuxt-app 開發規範

### 結構

```
pages/          # Nuxt 自動路由（.vue）
layouts/        # default.vue
stores/         # Pinia（.ts，TypeScript）
composables/    # useXxx.ts
  api/          # API composables（TanStack Query）
features/       # Domain-driven design
  user/
    types/      # TypeScript 型別
    schemas/    # Zod schemas
    services/   # API services
    queries/    # TanStack Query hooks
components/common/
```

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

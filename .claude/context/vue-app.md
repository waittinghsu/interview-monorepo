# Vue-App 規範速查

> 供 researcher / executor 快速確認 vue-app 的開發慣例。

---

## 基本資訊

| 項目 | 值 |
|------|----|
| 框架 | Vue 3 + Vite |
| Port | 9527 |
| 類型 | SPA（純客戶端渲染） |
| 語言 | **JavaScript**（非 TypeScript） |
| 路徑 | `apps/vue-app/` |

---

## 目錄結構

```
src/
├── pages/              # 頁面元件（對應 router）
├── components/
│   ├── common/         # 跨頁共用元件
│   └── home/           # 頁面專屬元件
├── layouts/
│   └── DefaultLayout.vue
├── stores/             # Pinia store（.js 格式）
├── composables/        # 可重用邏輯
├── api/
│   └── index.js        # axios 封裝，集中在此
├── utils/              # 工具函式
├── router/
│   └── index.js        # 手動路由定義
└── main.js             # 應用入口
```

---

## 新增頁面（3 步驟）

1. 建立 `src/pages/XxxPage.vue`
2. 在 `src/router/index.js` 加入路由（lazy import）
3. 在 `src/pages/HomePage.vue` 的 `actionButtons` 和 `gridItems` 加入入口

---

## Script 格式

```vue
<script setup>
// auto-import 可直接用：ref, computed, onMounted, useRouter, useRoute
// Pinia store auto-import：useThemeStore, useUserStore
// 不用寫 import，不用加型別
const router = useRouter()
</script>
```

---

## Pinia Store 格式（.js）

```javascript
import { defineStore } from 'pinia'

export const useXxxStore = defineStore('xxx', () => {
  const data = ref(null)

  function doSomething() {
    // 可以直接用 localStorage，無 SSR 問題
    localStorage.setItem('key', value)
  }

  return { data, doSomething }
})
```

---

## API 層

```javascript
// src/api/index.js — 唯一的 API 出口
export const userApi = createUserService(httpClient)

// 頁面中使用
import { userApi } from '@/api'
const result = await userApi.getProfile(id)
```

- 所有 API 呼叫集中在 `src/api/index.js`
- 使用 axios（由 `@interview/shared-api` 封裝）
- 不用 TanStack Query，不用 Zod

---

## 樣式規則

- **UnoCSS** utility class 為主
- 顏色一律用設計 token（`text-textBase`、`bg-sys-card` 等）
- 禁止 hardcode 顏色值
- scoped CSS 只用於動畫或無法用 utility 達成的情境

---

## 禁止修改的設定檔

- `vite.config.js`
- `uno.config.js`（vue-app 根目錄）

---

## ESLint 規範

- `@antfu/eslint-config`
- 縮排：2 spaces，single quote，無分號
- `no-console`：警告（允許存在但會提示）
- 修改後執行：`cd apps/vue-app && npx eslint --fix src/`

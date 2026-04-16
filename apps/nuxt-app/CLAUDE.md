# nuxt-app 開發規範

Nuxt 3 SSR，語言為 **TypeScript 嚴格模式**。
Port：30678 | Zeabur 觸發分支：`dev`

## 目錄結構

```
apps/nuxt-app/
├── pages/            # Nuxt 自動路由（kebab-case 命名）
├── layouts/          # 版面配置（default.vue）
├── stores/           # Pinia（.ts）
├── composables/
│   └── api/          # API composables（Axios + TanStack Query）
├── features/         # Domain-Driven Design 結構（新功能優先）
│   └── {domain}/
│       ├── types/    # TypeScript 型別
│       ├── schemas/  # Zod schemas（本地定義，不在 shared-api）
│       ├── services/ # API services（Nuxt $fetch）
│       ├── queries/  # TanStack Query hooks
│       └── index.ts  # 統一導出
├── services/         # 業務 service 層（Axios，配合 composables/api/）
│   ├── user.ts
│   └── stock.ts
└── components/
    └── common/
```

## API 架構（兩種並存）

### 1. DDD（新功能優先使用）

```typescript
import { useUserService, useUserInfoQuery } from '~/features/user'
const { getUserInfo } = useUserService()
const { data } = useUserInfoQuery()
```

### 2. Services + Composables（外部 API / 簡單情境）

```typescript
import { useStockChartQuery } from '~/composables/api/useStock'
const { data } = useStockChartQuery('0050.TW')
```

**規則**：
- ❌ 禁止在 `packages/shared-api` 定義業務 service 或 schemas
- ✅ Schemas 定義在 `features/{domain}/schemas/`（不要建根目錄 `schemas/`）
- ✅ 新功能優先使用 DDD（`features/`）

## 語言：TypeScript 嚴格模式

```vue
<script setup lang="ts">
// 所有 Nuxt auto-imports 可直接用：
// ref, computed, useState, useRoute, useRouter
// definePageMeta, useFetch, useAsyncData
</script>
```

## 新增頁面步驟

1. 建立 `pages/xxx.vue`（kebab-case 檔名）
2. 加上 `definePageMeta({ layout: 'default', title: '...' })`
3. Nuxt 自動產生路由，**不需手動設定**

## ESLint 特殊規則

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

- `no-console`：**允許**
- 自動修復：`cd apps/nuxt-app && npx eslint --fix .`

## Popup 系統（features/popup）

### 顯示規則（DisplayRule）

| 規則 | 說明 |
|------|------|
| `unlimited` | 無限顯示 |
| `once_ever` | 只顯示一次（永久記錄） |
| `once_daily` | 每日一次 |
| `once_weekly` | 每週一次，週一 00:00 reset |
| `once_per_login` | 每次真正重登才重置（guest 視為 unlimited） |

### 儲存結構（user-scoped）

```
localStorage key: popup_state_{userId}     → UserPopupState JSON（once_ever/daily/weekly）
localStorage key: popup_per_login_{userId} → string[] JSON（once_per_login 已顯示清單）
userId = userStore.user?.memberId ?? 'guest'
```

### 使用方式

```typescript
// stores/popup.ts 已整合，直接用 usePopupStore
const popupStore = usePopupStore()
popupStore.insert(task)  // 加入佇列
popupStore.dismiss()     // 關閉當前並標記已顯示
```

### 登入時重置 once_per_login

`usePopupQueue` 會 watch userId 切換，新用戶登入時自動呼叫 `clearPerLoginRecord(uid)`，讓 once_per_login 彈窗可再次顯示。

### 測試

```bash
pnpm --filter @interview/nuxt-app test
# 12 個測試（含 once_weekly / once_per_login / guest / userId 切換）
```

---

## 禁止修改的設定檔

- `nuxt.config.ts`
- `uno.config.ts`

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| Service ID | `69c66d86a972bb88a76276d3` |
| Project ID | `69c66d86a972bb88a76276cb` |
| 觸發分支 | `dev`（nuxt-stage-app）/ `main`（nuxt-app） |
| 類型 | Node.js SSR |
| Dockerfile | `apps/nuxt-app/Dockerfile.nuxt-app` |

**Zeabur Dockerfile 設定方式（新版）：**
後台服務設定 → Dockerfile 欄位 → 填入 `/apps/nuxt-app/Dockerfile.nuxt-app`
（`ZBPACK_DOCKERFILE_NAME` 和 `ZBPACK_ROOT_DIRECTORY` 均已棄用，勿使用環境變數控制）

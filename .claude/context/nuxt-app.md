# Nuxt-App 規範速查

> 供 researcher / executor 快速確認 nuxt-app 的開發慣例。

---

## 基本資訊

| 項目 | 值 |
|------|----|
| 框架 | Nuxt 3 |
| Port | 30678 |
| 類型 | SSR（伺服器端渲染） |
| 語言 | **TypeScript 嚴格模式** |
| 路徑 | `apps/nuxt-app/` |

---

## 目錄結構

```
apps/nuxt-app/
├── pages/              # Nuxt file-based 自動路由（kebab-case）
├── components/
│   └── common/         # 跨頁共用元件
├── layouts/
│   └── default.vue     # 預設 layout
├── composables/
│   ├── useApiClient.ts # $fetch 統一設定（攔截器）
│   └── api/            # API composables
├── features/           # Domain-Driven Design
│   └── {domain}/
│       ├── index.ts
│       ├── types/      # TypeScript 型別
│       ├── schemas/    # Zod schema
│       ├── services/   # API service
│       └── queries/    # TanStack Query hooks
├── stores/             # Pinia（.ts 格式）
├── plugins/            # Nuxt plugins（自動載入）
├── server/api/         # Nuxt Server Routes
├── types/              # 全域型別定義
└── nuxt.config.ts
```

---

## 新增頁面（2 步驟）

1. 建立 `pages/{kebab-case}.vue`
2. 加上 `definePageMeta`

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '頁面標題',
})
</script>
```

> Nuxt 自動產生路由，不需手動設定。

---

## Script 格式

```vue
<script setup lang="ts">
// Nuxt auto-import 可直接用（不用 import）：
// ref, computed, useState, useRoute, useRouter
// definePageMeta, useFetch, useAsyncData
// useNuxtApp, useRuntimeConfig

const router = useRouter()
const { data } = await useFetch('/api/xxx')
</script>
```

---

## Pinia Store 格式（.ts）

```typescript
import { defineStore } from 'pinia'

interface State {
  data: string | null
}

export const useXxxStore = defineStore('xxx', () => {
  const data = ref<string | null>(null)

  function doSomething() {
    // ⚠️ SSR 環境必須包 import.meta.client
    if (import.meta.client) {
      localStorage.setItem('key', data.value ?? '')
    }
  }

  return { data, doSomething }
})
```

---

## API 層（3 層架構）

```
Endpoint
  └─ composables/useApiClient.ts    ← $fetch 統一設定（token、攔截器）
       └─ features/{domain}/services/{domain}.service.ts  ← 業務邏輯
            └─ features/{domain}/queries/{domain}.queries.ts  ← TanStack Query
```

### Layer 1：API Client（只有一個，不用改）

```typescript
// composables/useApiClient.ts — 統一 $fetch 設定
export function useApiClient() {
  return $fetch.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    onRequest({ options }) { /* token 注入 */ },
    onResponseError({ response }) { /* 統一錯誤處理 */ },
  })
}
```

### Layer 2：Service（新功能時新增）

```typescript
// features/{domain}/services/{domain}.service.ts
export function useXxxService() {
  const api = useApiClient()
  return {
    async getXxx(id: string): Promise<XxxType> {
      const raw = await api<unknown>(`/xxx/${id}`)
      return xxxSchema.parse(raw)  // Zod 驗證
    },
  }
}
```

### Layer 3：Query（CSR 快取用）

```typescript
// features/{domain}/queries/{domain}.queries.ts
export function useXxxQuery(id: string) {
  const service = useXxxService()
  return useQuery({
    queryKey: ['xxx', id],
    queryFn: () => service.getXxx(id),
    staleTime: 1000 * 60 * 5,
  })
}
```

---

## Zod Schema 格式

```typescript
// features/{domain}/schemas/{domain}.schema.ts
import { z } from 'zod'

export const xxxSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
})

export type XxxType = z.infer<typeof xxxSchema>
```

---

## SSR 注意事項

| 情況 | 正確做法 |
|------|---------|
| 存取 `window` / `document` | 包在 `if (import.meta.client)` 內 |
| 存取 `localStorage` | 包在 `if (import.meta.client)` 內 |
| 初始化資料 | 用 `useFetch` 或 `useAsyncData`（支援 SSR hydration） |
| 事件監聽 | 在 `onMounted` 內（onMounted 只在 client 執行） |

---

## ESLint 規範

```typescript
// ✅ Array 泛型明確指定
Array.from<number>({ length: 10 }).fill(0)

// ✅ QInput onChange 型別
function handleInput(value: string | number | null) {
  const str = String(value ?? '')
}
```

- `@antfu/eslint-config`
- 縮排：2 spaces，single quote，無分號
- `no-console`：允許
- 修改後執行：`cd apps/nuxt-app && npx eslint --fix .`

---

## 禁止修改的設定檔

- `nuxt.config.ts`
- `uno.config.ts`（nuxt-app 根目錄）
- `capacitor.config.ts`
- `quasar.config.ts`

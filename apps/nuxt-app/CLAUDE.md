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

## 禁止修改的設定檔

- `nuxt.config.ts`
- `uno.config.ts`

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| Service ID | `69c66d86a972bb88a76276d3` |
| Project ID | `69c66d86a972bb88a76276cb` |
| 觸發分支 | `dev` |
| ZBPACK_ROOT_DIRECTORY | 未設定（使用根目錄 zbpack.json） |
| 類型 | Node.js SSR |
| zbpack 設定 | `apps/nuxt-app/zbpack.json`（備用） |

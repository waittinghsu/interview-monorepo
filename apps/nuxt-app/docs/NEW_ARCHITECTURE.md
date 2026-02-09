# Nuxt 3 新架構說明

## 📁 模組化檔案結構

按照功能模組組織，而不是技術類型：

```
apps/nuxt-app/
├── composables/
│   └── useApiClient.ts           # 統一 API 攔截器
│
├── modules/                       # 功能模組
│   └── user/                      # 會員模組
│       ├── schemas/
│       │   └── user.schema.ts    # Zod Schema + Types
│       ├── services/
│       │   └── user.service.ts   # API 調用封裝
│       ├── queries/
│       │   └── user.queries.ts   # TanStack Query hooks
│       ├── types/
│       │   └── user.types.ts     # TypeScript 類型
│       └── index.ts               # 模組統一入口
│
├── server/api/
│   └── userinfo.ts                # Mock API 端點
│
└── pages/
    └── user-info.vue              # 使用範例
```

## 🏗️ 架構層次

### 1. 攔截器層 (Interceptor Layer)

**檔案**: `composables/useApiClient.ts`

**職責**:
- 統一配置 `$fetch`
- Request/Response 攔截
- Abort Controller 管理
- 錯誤處理
- Token 管理
- 日誌記錄

**特點**:
```typescript
const api = $fetch.create({
  baseURL: '/api',
  onRequest({ options, request }) {
    // 1. 取消重複請求
    // 2. 添加 Authorization header
    // 3. 記錄請求日誌
  },
  onResponse({ request, response }) {
    // 清理 controller、記錄回應
  },
  onResponseError({ response }) {
    // 統一錯誤處理（401, 403, 404, 5xx）
  }
})
```

### 2. Schema 層 (Validation Layer)

**檔案**: `modules/user/schemas/user.schema.ts`

**職責**:
- 使用 Zod 定義資料結構
- Runtime 型別驗證
- TypeScript 型別推導
- API 回應格式標準化

**範例**:
```typescript
export const userInfoSchema = z.object({
  memberId: z.number(),
  name: z.string(),
  email: z.string().email(),
  level: z.number().min(1).max(12),
  // ...
})

export type UserInfo = z.infer<typeof userInfoSchema>
```

### 3. Service 層 (Business Logic Layer)

**檔案**: `modules/user/services/user.service.ts`

**職責**:
- 封裝所有 API 調用
- 使用 useApiClient
- Zod 驗證回應
- 錯誤處理
- 資料轉換

**範例**:
```typescript
export function useUserService() {
  const api = useApiClient()

  return {
    async getUserInfo(): Promise<UserInfo> {
      const response = await api('/userinfo')
      const validated = userInfoResponseSchema.parse(response)
      return validated.data
    }
  }
}
```

### 4. Query 層 (State Management Layer)

**檔案**: `modules/user/queries/user.queries.ts`

**職責**:
- TanStack Query hooks
- 快取管理
- Query Keys 統一管理
- Mutation 處理
- Optimistic Updates

**範例**:
```typescript
export const userQueryKeys = {
  all: ['user'] as const,
  info: () => [...userQueryKeys.all, 'info'] as const,
}

export function useUserInfoQuery() {
  const service = useUserService()

  return useQuery({
    queryKey: userQueryKeys.info(),
    queryFn: () => service.getUserInfo(),
    staleTime: 1000 * 60 * 5,
  })
}
```

### 5. 頁面層 (Presentation Layer)

**檔案**: `pages/user-info.vue`

**職責**:
- SSR 資料預取 (useAsyncData)
- CSR 狀態管理 (TanStack Query)
- UI 渲染
- 使用者互動

**範例**:
```typescript
// SSR
const { data: ssrData } = await useAsyncData('userInfo', async () => {
  const service = useUserService()
  return await service.getUserInfo()
})

// CSR
const { data, isPending, error, refetch } = useUserInfoQuery()
```

## 🎯 設計原則

### 1. 單一職責
- 每層只負責一件事
- Schema 只管驗證
- Service 只管 API
- Query 只管狀態

### 2. 依賴注入
```typescript
// ✅ 好 - 使用 composable
const api = useApiClient()
const service = useUserService()

// ❌ 壞 - 直接調用
$fetch('/api/userinfo')
```

### 3. 型別安全
```typescript
// Schema 定義
export const userInfoSchema = z.object({...})

// 自動推導型別
export type UserInfo = z.infer<typeof userInfoSchema>

// Runtime 驗證
const validated = userInfoSchema.parse(response)
```

### 4. 模組化
```
modules/user/      # 會員相關的所有東西都在這裡
modules/product/   # 商品相關的所有東西都在這裡
modules/order/     # 訂單相關的所有東西都在這裡
```

## 📊 資料流向

```
┌─────────────────────────────────────────────────────┐
│                   Page Component                     │
│  (SSR: useAsyncData + CSR: TanStack Query)          │
└────────────────┬───────────────────┬─────────────────┘
                 │                   │
         ┌───────▼───────┐   ┌──────▼─────────┐
         │   useQuery     │   │  useAsyncData  │
         │  (CSR only)    │   │  (SSR + CSR)   │
         └───────┬───────┘   └──────┬─────────┘
                 │                   │
                 └─────────┬─────────┘
                           │
                   ┌───────▼────────┐
                   │  useService    │
                   │ (Business API) │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │ useApiClient   │
                   │ (Interceptor)  │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │    $fetch      │
                   │  (HTTP Call)   │
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │  Zod Schema    │
                   │  (Validation)  │
                   └────────────────┘
```

## 🔄 SSR vs CSR 策略

### SSR (useAsyncData)
**使用時機**:
- 首次頁面載入
- SEO 重要的資料
- 需要快速顯示的內容

**優點**:
- 更快的首屏渲染
- 更好的 SEO
- 減少 Layout Shift

### CSR (TanStack Query)
**使用時機**:
- 使用者互動後
- 需要即時更新的資料
- 需要快取管理

**優點**:
- 自動快取
- 背景更新
- Optimistic Updates
- 請求去重

## 🆕 新增模組流程

### 1. 建立模組目錄
```bash
mkdir -p modules/product/{schemas,services,queries,types}
```

### 2. 定義 Schema
```typescript
// modules/product/schemas/product.schema.ts
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
})

export type Product = z.infer<typeof productSchema>
```

### 3. 建立 Service
```typescript
// modules/product/services/product.service.ts
export function useProductService() {
  const api = useApiClient()

  return {
    async getProducts() {
      const response = await api('/products')
      return productListSchema.parse(response).data
    }
  }
}
```

### 4. 建立 Queries
```typescript
// modules/product/queries/product.queries.ts
export const productQueryKeys = {
  all: ['product'] as const,
  list: () => [...productQueryKeys.all, 'list'] as const,
}

export function useProductsQuery() {
  const service = useProductService()

  return useQuery({
    queryKey: productQueryKeys.list(),
    queryFn: () => service.getProducts(),
  })
}
```

### 5. 建立統一入口
```typescript
export * from './queries/product.queries'
// modules/product/index.ts
export * from './schemas/product.schema'
export * from './services/product.service'
```

### 6. 在頁面使用
```vue
<script setup>
import { useProductsQuery } from '~/modules/product'

const { data: products, isPending } = useProductsQuery()
</script>
```

## 🎓 最佳實踐

### 1. Query Keys 管理
```typescript
// ✅ 好 - 集中管理
export const userQueryKeys = {
  all: ['user'] as const,
  info: () => [...userQueryKeys.all, 'info'] as const,
  detail: (id: number) => [...userQueryKeys.all, 'detail', id] as const,
}

// ❌ 壞 - 散落各處
useQuery({ queryKey: ['user', 'info'] })
```

### 2. 錯誤處理
```typescript
// Service 層統一處理
try {
  const response = await api('/userinfo')
  return userInfoResponseSchema.parse(response).data
}
catch (error) {
  // 已經在 useApiClient 攔截器中處理
  throw error
}
```

### 3. Loading 狀態
```vue
<!-- 使用 Query 提供的狀態 -->
<div v-if="isPending">
載入中...
</div>

<div v-else-if="error">
錯誤: {{ error.message }}
</div>

<div v-else>
{{ data }}
</div>
```

### 4. 快取策略
```typescript
useQuery({
  queryKey: userQueryKeys.info(),
  queryFn: () => service.getUserInfo(),
  staleTime: 1000 * 60 * 5, // 5 分鐘內不重新請求
  gcTime: 1000 * 60 * 10, // 10 分鐘後清除快取
})
```

## 📚 延伸閱讀

- [Nuxt 3 Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
- [TanStack Query](https://tanstack.com/query/latest/docs/vue/overview)
- [Zod](https://zod.dev/)
- [$fetch / ofetch](https://github.com/unjs/ofetch)

## 🔍 與舊架構對比

| 項目 | 舊架構 | 新架構 |
|------|--------|--------|
| 攔截器 | ❌ 無 | ✅ useApiClient |
| 型別驗證 | ❌ 僅 TS | ✅ Zod Runtime |
| 狀態管理 | 簡單 useFetch | ✅ TanStack Query |
| 檔案組織 | 按類型 (types/, api/) | ✅ 按模組 (modules/user/) |
| Abort 管理 | ❌ 無 | ✅ 自動取消重複請求 |
| 錯誤處理 | 分散各處 | ✅ 統一攔截器 |
| SSR 支援 | ✅ | ✅ |
| 快取管理 | 基本 | ✅ 完整 (staleTime, gcTime) |

## 🚀 遷移指南

從舊架構遷移到新架構：

1. **保留舊代碼**: 新舊架構可共存
2. **逐步遷移**: 一個模組一個模組遷移
3. **測試驗證**: 確保功能正常
4. **刪除舊代碼**: 全部遷移完成後清理

```bash
# 舊檔案（可逐步刪除）
types/api.ts
composables/api/useUserInfo.ts

# 新檔案
modules/user/...
```

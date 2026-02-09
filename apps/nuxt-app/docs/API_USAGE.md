# Nuxt $fetch API 使用指南

## 概述

本專案使用 Nuxt 原生的 `$fetch` API 來處理 HTTP 請求，而不是使用 shared-api 的 axios。這樣可以更好地利用 Nuxt 的 SSR 特性和優化。

## 架構

```
apps/nuxt-app/
├── types/
│   └── api.ts              # API 類型定義
├── server/
│   └── api/
│       └── userinfo.ts     # Mock API 端點
└── composables/
    └── api/
        └── useUserInfo.ts  # API Composable
```

## 類型定義

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}
```

### UserInfo
```typescript
interface UserInfo {
  memberId: number        // 會員編號
  name: string           // 會員名字
  nickname: string       // 會員暱稱
  phone: string          // 會員手機
  email: string          // 會員信箱
  balance: string        // 儲值金額
  level: number          // 會員等級 1~12
  avatarId: number       // 會員頭像編號 1~30
  bookmarks: number[]    // 會員書籤收藏清單
}
```

## Mock API

### GET /api/userinfo

返回會員資料的 mock 數據。

**Response:**
```json
{
  "code": 200,
  "data": {
    "memberId": 1001,
    "name": "王小明",
    "nickname": "小明",
    "phone": "0912345678",
    "email": "xiaoming@example.com",
    "balance": "12580.00",
    "level": 8,
    "avatarId": 15,
    "bookmarks": [1, 5, 12, 28, 35, 67, 89]
  }
}
```

## Composable 使用方式

提供三種不同的使用方式：

### 1. useFetchUserInfo() - 推薦用於 SSR

```vue
<script setup>
// SSR 友好，自動處理服務端和客戶端
const { data, pending, error, refresh } = useFetchUserInfo()

// 取得會員資料
const userInfo = computed(() => data.value?.data)
</script>
```

**特點：**
- ✅ 自動 SSR/CSR
- ✅ 自動錯誤處理
- ✅ 響應式數據
- ✅ 內建 loading 狀態

### 2. useAsyncUserInfo() - 更靈活的控制

```vue
<script setup>
// 使用 useAsyncData，可以自定義 key 和選項
const { data: userInfo, pending, error, refresh } = useAsyncUserInfo()
</script>
```

**特點：**
- ✅ 自定義快取 key
- ✅ 可以配置更多選項
- ✅ 自動轉換數據格式

### 3. useUserInfo() - 客戶端手動調用

```vue
<script setup>
const { getUserInfo } = useUserInfo()
const userInfo = ref(null)
const isLoading = ref(false)

const fetchData = async () => {
  isLoading.value = true
  try {
    userInfo.value = await getUserInfo()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
```

**特點：**
- ✅ 完全控制調用時機
- ✅ 適合事件觸發的請求
- ⚠️ 僅客戶端運行

## 完整範例

查看 `pages/user-info.vue` 了解完整的使用示範。

## 建立新的 API 端點

### 1. 定義類型 (types/api.ts)

```typescript
export interface NewDataType {
  id: number
  name: string
}
```

### 2. 建立 Server API (server/api/newdata.ts)

```typescript
export default defineEventHandler((): ApiResponse<NewDataType> => {
  return {
    code: 200,
    data: {
      id: 1,
      name: 'Example'
    }
  }
})
```

### 3. 建立 Composable (composables/api/useNewData.ts)

```typescript
export function useFetchNewData() {
  return useFetch<ApiResponse<NewDataType>>('/api/newdata')
}
```

## 與 shared-api 的比較

### Nuxt $fetch (當前實作)
- ✅ SSR 優化
- ✅ 自動請求去重
- ✅ 更輕量
- ✅ TypeScript 支援好
- ❌ 僅限 Nuxt 專案使用

### shared-api (axios)
- ✅ 跨專案共享
- ✅ 功能完整
- ✅ 攔截器豐富
- ❌ 需要額外依賴
- ❌ SSR 支援需額外配置

## 最佳實踐

1. **優先使用 useFetch 或 useAsyncData**
   - 在 setup 階段調用
   - 利用 SSR 優勢

2. **需要手動控制時使用 $fetch**
   - 事件處理器中
   - 條件性請求

3. **統一錯誤處理**
   - 在 composable 層處理常見錯誤
   - 在組件層處理 UI 反饋

4. **類型安全**
   - 定義明確的 TypeScript 介面
   - 使用泛型確保類型正確

## 測試

訪問 http://localhost:30678/user-info 查看示範頁面。
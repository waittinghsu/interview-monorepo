# API Spec

> 最後更新：2026-03-10 00:00
> Swagger 版本：OpenAPI 3.0.3
> 由 API Agent 維護，其他 agent 只需讀此檔案，無需理解 Swagger

---

## 基本資訊

| 項目 | 說明 |
|------|------|
| **Production Base URL** | `https://api-server.zeabur.app` |
| **Local Base URL** | `http://localhost:3001` |
| **API 前綴** | `/v1/api` |
| **Swagger UI** | `http://localhost:3001/docs` |
| **Swagger JSON** | `http://localhost:3001/docs/json` |

---

## 認證方式

所有需要認證的 endpoint 使用 **JWT Bearer Token**。

```
Authorization: Bearer <token>
```

- Token 由登入 (`POST /v1/api/user/login`) 取得
- 每次呼叫 `GET /v1/api/user/info` 時，後端會自動刷新 token，請存入 response 的 `data.token`
- Token 有效期：**7 天**

---

## 統一 Response 格式

所有 API 均返回以下結構：

```typescript
interface ApiResponse<T> {
  code: number   // 商業邏輯驗證碼，200 = 成功
  msg: string    // 操作結果描述，成功時通常為 "OK"
  data: T        // 實際資料，失敗時可能為 null
}
```

**注意**：`code` 是**商業邏輯驗證碼**，與 HTTP status code 不同。HTTP 層成功 (2xx) 但 `code` 非 200 表示業務邏輯失敗。

---

## 分頁格式

所有列表類 API 的 `data` 結構：

```typescript
interface PaginatedResponse<T> {
  list: T[]        // 當頁資料陣列
  total: number    // 符合條件的總筆數
  page: number     // 當前頁碼
  limit: number    // 每頁筆數
  totalPages: number  // 總頁數
}
```

---

## 使用者類 (User)

### `login`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/user/login` |
| **說明** | 使用電子信箱與密碼進行身份驗證，成功後返回 JWT token 與用戶資訊 |
| **認證** | 不需要 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `email` | `string (email)` | ✅ | 用戶登入的電子郵件地址 |
| `password` | `string` | ✅ | 用戶密碼，至少 6 個字元 |

**回傳值 `data`**

```typescript
{
  token: string   // JWT Token，有效期 7 天
  user: {
    memberId: string   // 用戶唯一識別碼（CUID）
    name: string       // 真實姓名
    nickname: string   // 顯示暱稱
    phone: string      // 手機號碼（台灣格式 09xxxxxxxx）
    email: string      // 電子信箱
    level: number      // 會員等級編號（對應 MemberLevel 的 levelId）
    avatarId: number   // 頭像編號（範圍 1–14）
    role: string       // 角色：super | admin | member | noob
    balance: string    // 帳戶餘額（新台幣，字串避免精度損失）
    bookmarks: number[] // 書籤 ID 列表（5–10 個）
  }
}
```

**使用範例**

```typescript
const data = await login({ email: 'demo@example.com', password: 'password123' })
const token = data.token
const user = data.user
```

---

### `logout`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/user/logout` |
| **說明** | 登出當前用戶（前端清除 token 即可，後端記錄登出事件） |
| **認證** | Bearer Token 必填 |

**回傳值 `data`**

```typescript
null  // 登出無返回資料
```

**使用範例**

```typescript
await logout()
// 登出後清除本地 token
```

---

### `getUserInfo`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/user/info` |
| **說明** | 根據 JWT token 取得當前登入用戶的完整資料，並自動刷新 token |
| **認證** | Bearer Token 必填 |

**回傳值 `data`**

```typescript
{
  token: string   // 刷新後的 JWT Token（請存儲並取代舊 token）
  user: {
    memberId: string   // 用戶唯一識別碼（CUID）
    name: string       // 真實姓名
    nickname: string   // 顯示暱稱
    phone: string      // 手機號碼（台灣格式 09xxxxxxxx）
    email: string      // 電子信箱
    level: number      // 會員等級（1–13）
    avatarId: number   // 頭像編號（1–14）
    role: string       // 角色：super | admin | member | noob
    balance: string    // 帳戶餘額（新台幣，字串）
    bookmarks: number[] // 書籤 ID 列表（5–10 個）
  }
}
```

**使用範例**

```typescript
const data = await getUserInfo()
// 必須更新存儲的 token
store.setToken(data.token)
const user = data.user
```

---

### `updateUserInfo`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `PUT /v1/api/user/info` |
| **說明** | 更新當前登入用戶的暱稱、電子信箱與書籤列表 |
| **認證** | Bearer Token 必填 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `nickname` | `string` | ✅ | 用戶的顯示暱稱 |
| `email` | `string (email)` | ✅ | 用戶的電子郵件地址 |
| `bookmarks` | `number[]` | ✅ | 書籤 ID 列表（最少 5 個，最多 10 個） |

**回傳值 `data`**

```typescript
{
  memberId: string   // 用戶唯一識別碼（CUID）
  name: string       // 真實姓名
  nickname: string   // 顯示暱稱
  phone: string      // 手機號碼
  email: string      // 電子信箱
  level: number      // 會員等級
  avatarId: number   // 頭像編號
  role: string       // 角色
  balance: string    // 帳戶餘額（字串）
  bookmarks: number[] // 更新後的書籤列表
}
```

**使用範例**

```typescript
const data = await updateUserInfo({
  nickname: 'omega',
  email: 'kira@yamato.com',
  bookmarks: [1, 2, 3, 4, 5],
})
```

---

## 遊戲類 (Games)

### `getGames`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/games` |
| **說明** | 取得遊戲列表，支援分頁、類型篩選與關鍵字搜尋 |
| **認證** | 不需要 |

**Query Parameters**

| 名稱 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `page` | `integer` | ❌ | `1` | 分頁頁碼，從 1 開始 |
| `limit` | `integer` | ❌ | `10` | 每頁顯示的資料筆數 |
| `genre` | `string` | ❌ | — | 依遊戲類型篩選 |
| `keyword` | `string` | ❌ | — | 依遊戲名稱或描述搜尋 |

**回傳值 `data`**

```typescript
{
  list: GameItem[]   // 遊戲資料陣列
  total: number      // 符合條件的總筆數
  page: number       // 當前頁碼
  limit: number      // 每頁筆數
  totalPages: number // 總頁數
}

interface GameItem {
  gameId: string      // 遊戲唯一識別碼（CUID）
  title: string       // 遊戲名稱
  description: string // 遊戲簡介
  genre: string       // 遊戲類型（如 RPG、Action、Strategy）
  platform: string[]  // 支援平台列表
  rating: string      // 評分（0–10，字串）
  price: string       // 售價（新台幣，字串）
  releaseDate: string // 發售日期（ISO8601）
  developer: string   // 開發商
  publisher: string   // 發行商
  imageUrl: string    // 封面圖片 URL
  tags: string[]      // 標籤列表
  isActive: boolean   // 是否上架
  createdAt: string   // 建立時間
  updatedAt: string   // 更新時間
}
```

**使用範例**

```typescript
const data = await getGames({ page: 1, limit: 10, genre: 'RPG', keyword: '勇者' })
const games = data.list
const total = data.total
```

---

### `createGame`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/games` |
| **說明** | 新增遊戲資料 |
| **認證** | Bearer Token 必填 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `title` | `string` | ✅ | 遊戲的完整名稱 |
| `description` | `string` | ✅ | 遊戲詳細介紹 |
| `genre` | `string` | ✅ | 遊戲類別 |
| `platform` | `string[]` | ✅ | 支援的平台列表 |
| `price` | `number` | ✅ | 遊戲定價（新台幣） |
| `releaseDate` | `string` | ✅ | 發售日期（ISO8601） |
| `developer` | `string` | ✅ | 開發商名稱 |
| `publisher` | `string` | ✅ | 發行商名稱 |
| `rating` | `number` | ❌ | 評分（0–10） |
| `imageUrl` | `string` | ❌ | 封面圖片 URL |
| `tags` | `string[]` | ❌ | 標籤陣列 |
| `isActive` | `boolean` | ❌ | 是否上架，預設 `true` |

**回傳值 `data`**

```typescript
GameItem  // 同 getGames 的 GameItem 結構
```

---

### `getGameById`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/games/{gameId}` |
| **說明** | 取得單一遊戲詳情 |
| **認證** | 不需要 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `gameId` | `string` | ✅ | 遊戲唯一識別碼（CUID） |

**回傳值 `data`**

```typescript
GameItem  // 同 getGames 的 GameItem 結構
```

**使用範例**

```typescript
const data = await getGameById({ gameId: 'clxxxxx' })
```

---

### `updateGame`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `PUT /v1/api/games/{gameId}` |
| **說明** | 更新遊戲資訊（部分更新，所有欄位皆為選填） |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `gameId` | `string` | ✅ | 遊戲唯一識別碼 |

**Request Body**（所有欄位皆選填）

| 名稱 | 型別 | 說明 |
|------|------|------|
| `title` | `string` | 遊戲名稱 |
| `description` | `string` | 遊戲簡介 |
| `genre` | `string` | 遊戲類型 |
| `platform` | `string[]` | 支援平台 |
| `rating` | `number` | 評分 |
| `price` | `number` | 售價 |
| `releaseDate` | `string` | 發售日期（ISO8601） |
| `developer` | `string` | 開發商 |
| `publisher` | `string` | 發行商 |
| `imageUrl` | `string` | 封面圖片 URL |
| `tags` | `string[]` | 標籤 |
| `isActive` | `boolean` | 上架狀態 |

**回傳值 `data`**

```typescript
GameItem  // 更新後的完整遊戲資料
```

---

### `deleteGame`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `DELETE /v1/api/games/{gameId}` |
| **說明** | 刪除指定遊戲 |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `gameId` | `string` | ✅ | 遊戲唯一識別碼 |

**回傳值 `data`**

```typescript
null
```

---

## 書籍類 (Books)

### `getBooks`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/books` |
| **說明** | 取得書籍列表，支援分頁、類型篩選、關鍵字搜尋與庫存篩選 |
| **認證** | 不需要 |

**Query Parameters**

| 名稱 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `page` | `integer` | ❌ | `1` | 分頁頁碼 |
| `limit` | `integer` | ❌ | `10` | 每頁筆數 |
| `genre` | `string` | ❌ | — | 依書籍類型篩選 |
| `keyword` | `string` | ❌ | — | 依書名或作者搜尋 |
| `inStock` | `boolean` | ❌ | — | 只顯示有庫存的書籍 |

**回傳值 `data`**

```typescript
{
  list: BookItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface BookItem {
  bookId: string      // 書籍唯一識別碼（CUID）
  title: string       // 書名
  author: string      // 作者
  isbn: string        // ISBN-13
  description: string // 書籍簡介
  genre: string       // 書籍類型（如科幻、歷史、商業）
  price: string       // 定價（新台幣，字串）
  publishDate: string // 出版日期（ISO8601）
  publisher: string   // 出版社
  totalPages: number  // 總頁數
  language: string    // 語言（如 zh-TW、zh-CN、en）
  coverUrl: string    // 封面圖片 URL
  rating: string      // 評分（0–10，字串）
  inStock: boolean    // 是否有庫存
  createdAt: string   // 建立時間
  updatedAt: string   // 更新時間
}
```

**使用範例**

```typescript
const data = await getBooks({ page: 1, limit: 10, keyword: '三體', inStock: true })
const books = data.list
```

---

### `createBook`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/books` |
| **說明** | 新增書籍資料 |
| **認證** | Bearer Token 必填 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `title` | `string` | ✅ | 書籍完整名稱 |
| `author` | `string` | ✅ | 作者姓名 |
| `isbn` | `string` | ✅ | 國際標準書號 |
| `description` | `string` | ✅ | 書籍詳細介紹 |
| `genre` | `string` | ✅ | 書籍分類 |
| `price` | `number` | ✅ | 書籍定價 |
| `publishDate` | `string` | ✅ | 出版日期（ISO8601） |
| `publisher` | `string` | ✅ | 出版社名稱 |
| `totalPages` | `integer` | ✅ | 書籍總頁數 |
| `language` | `string` | ❌ | 語言代碼，預設 `zh-TW` |
| `coverUrl` | `string` | ❌ | 封面圖片 URL |
| `rating` | `number` | ❌ | 評分（0–10） |
| `inStock` | `boolean` | ❌ | 是否有庫存 |

**回傳值 `data`**

```typescript
BookItem  // 同 getBooks 的 BookItem 結構
```

---

### `getBookById`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/books/{bookId}` |
| **說明** | 取得單一書籍詳情 |
| **認證** | 不需要 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `bookId` | `string` | ✅ | 書籍唯一識別碼（CUID） |

**回傳值 `data`**

```typescript
BookItem  // 同 getBooks 的 BookItem 結構
```

---

### `updateBook`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `PUT /v1/api/books/{bookId}` |
| **說明** | 更新書籍資訊（部分更新，所有欄位皆為選填） |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `bookId` | `string` | ✅ | 書籍唯一識別碼 |

**Request Body**（所有欄位皆選填）

| 名稱 | 型別 | 說明 |
|------|------|------|
| `title` | `string` | 書名 |
| `author` | `string` | 作者 |
| `isbn` | `string` | ISBN |
| `description` | `string` | 書籍簡介 |
| `genre` | `string` | 書籍類型 |
| `price` | `number` | 定價 |
| `publishDate` | `string` | 出版日期（ISO8601） |
| `publisher` | `string` | 出版社 |
| `totalPages` | `integer` | 總頁數 |
| `language` | `string` | 語言 |
| `coverUrl` | `string` | 封面 URL |
| `rating` | `number` | 評分 |
| `inStock` | `boolean` | 庫存狀態 |

**回傳值 `data`**

```typescript
BookItem  // 更新後的完整書籍資料
```

---

### `deleteBook`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `DELETE /v1/api/books/{bookId}` |
| **說明** | 刪除指定書籍 |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `bookId` | `string` | ✅ | 書籍唯一識別碼 |

**回傳值 `data`**

```typescript
null
```

---

## 會員等級類 (Member Levels)

### `getMemberLevels`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/member-levels` |
| **說明** | 取得會員等級列表，依 levelId 升序排列 |
| **認證** | 不需要 |

**Query Parameters**

| 名稱 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `page` | `integer` | ❌ | `1` | 分頁頁碼 |
| `limit` | `integer` | ❌ | `20` | 每頁筆數（等級數量通常不多） |

**回傳值 `data`**

```typescript
{
  list: MemberLevelItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface MemberLevelItem {
  levelId: number    // 等級編號（由小到大代表等級由低到高）
  name: string       // 等級顯示名稱
  minPoints: number  // 達到此等級的最低累積點數
  maxPoints: number  // 此等級最高點數上限（-1 表示無上限）
  discount: string   // 消費折扣率（1.00 = 無折扣，0.85 = 85折，字串）
  benefits: string[] // 此等級專屬福利列表
  badgeUrl: string   // 等級徽章圖片 URL
  createdAt: string  // 建立時間
  updatedAt: string  // 更新時間
}
```

**使用範例**

```typescript
const data = await getMemberLevels({ page: 1, limit: 20 })
const levels = data.list
```

---

### `createMemberLevel`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/member-levels` |
| **說明** | 新增會員等級 |
| **認證** | Bearer Token 必填 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `levelId` | `integer` | ✅ | 唯一等級編號，從 1 開始 |
| `name` | `string` | ✅ | 等級顯示名稱 |
| `minPoints` | `integer` | ✅ | 達到此等級的最低點數門檻 |
| `maxPoints` | `integer` | ✅ | 此等級最高點數上限 |
| `discount` | `number` | ❌ | 消費折扣率（1.00 = 無折扣） |
| `benefits` | `string[]` | ❌ | 會員福利列表 |
| `badgeUrl` | `string` | ❌ | 徽章圖片 URL |

**回傳值 `data`**

```typescript
MemberLevelItem  // 同 getMemberLevels 的 MemberLevelItem 結構
```

---

### `getMemberLevelById`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/member-levels/{levelId}` |
| **說明** | 取得單一會員等級詳情 |
| **認證** | 不需要 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `levelId` | `integer` | ✅ | 會員等級編號 |

**回傳值 `data`**

```typescript
MemberLevelItem  // 同 getMemberLevels 的 MemberLevelItem 結構
```

---

### `updateMemberLevel`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `PUT /v1/api/member-levels/{levelId}` |
| **說明** | 更新會員等級（部分更新） |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `levelId` | `integer` | ✅ | 會員等級編號 |

**Request Body**（所有欄位皆選填）

| 名稱 | 型別 | 說明 |
|------|------|------|
| `name` | `string` | 等級名稱 |
| `minPoints` | `integer` | 最低點數 |
| `maxPoints` | `integer` | 最高點數 |
| `discount` | `number` | 折扣率 |
| `benefits` | `string[]` | 會員福利 |
| `badgeUrl` | `string` | 徽章 URL |

**回傳值 `data`**

```typescript
MemberLevelItem  // 更新後的完整等級資料
```

---

### `deleteMemberLevel`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `DELETE /v1/api/member-levels/{levelId}` |
| **說明** | 刪除指定會員等級 |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `levelId` | `integer` | ✅ | 會員等級編號 |

**回傳值 `data`**

```typescript
null
```

---

## 股票類 (Stock)

### `getStockChart`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/stock/chart/{symbol}` |
| **說明** | 取得股票即時報價與歷史圖表走勢資料（代理 Yahoo Finance v8 chart API） |
| **認證** | 不需要 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `symbol` | `string` | ✅ | 股票代號（台股加 `.TW` 後綴，如 `0050.TW`；美股直接使用如 `AAPL`） |

**Query Parameters**

| 名稱 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `range` | `string` | ❌ | `1d` | 預設時間範圍：`1d` `5d` `1mo` `3mo` `6mo` `1y` `2y` `5y` `10y` `ytd` `max`（使用 period1/period2 時忽略） |
| `interval` | `string` | ❌ | `5m` | 取樣間隔：`1m` `2m` `5m` `15m` `30m` `60m` `90m` `1h` `1d` `5d` `1wk` `1mo` `3mo`（分鐘級別最多回查60天） |
| `period1` | `integer` | ❌ | — | 自訂起始 Unix timestamp（秒），需與 `period2` 同時使用 |
| `period2` | `integer` | ❌ | — | 自訂結束 Unix timestamp（秒），需與 `period1` 同時使用 |
| `events` | `string` | ❌ | — | 附加事件資料：`div`=股息, `split`=拆股, `earn`=財報，可組合如 `div\|split` |
| `includeAdjustedClose` | `boolean` | ❌ | `false` | 是否包含還原後收盤價（調整股息/拆股影響） |

**回傳值 `data`**

```typescript
{
  // --- Meta ---
  symbol: string               // 股票代號
  longName: string             // 股票完整名稱
  currency: string             // 交易貨幣（如 TWD、USD）
  exchangeName: string         // 交易所代碼
  dataGranularity: string      // 實際使用的取樣間隔（如 '1d'）
  range: string                // 實際使用的時間範圍（如 '1mo'）
  validRanges: string[]        // 該標的支援的所有 range 值

  // --- 即時行情 ---
  price: number                // 最新成交價
  previousClose: number        // 前日收盤價
  regularMarketOpen: number    // 今日開盤價
  regularMarketDayHigh: number // 今日最高價
  regularMarketDayLow: number  // 今日最低價
  regularMarketVolume: number  // 今日成交量

  // --- OHLCV 歷史序列（與 timestamps 一一對應，含 null）---
  timestamps: number[]         // Unix 時間戳陣列
  open: (number | null)[]      // 開盤價序列
  high: (number | null)[]      // 最高價序列
  low: (number | null)[]       // 最低價序列
  close: (number | null)[]     // 收盤價序列
  volume: (number | null)[]    // 成交量序列

  adjclose?: (number | null)[] // 還原收盤價（includeAdjustedClose=true 時才有）
}
```

**使用範例**

```typescript
// 台股今日 5 分鐘 K
const data = await getStockChart({ symbol: '0050.TW', range: '1d', interval: '5m' })

// 美股近一年日 K（含還原收盤價）
const data = await getStockChart({ symbol: 'AAPL', range: '1y', interval: '1d', includeAdjustedClose: true })

// 加密貨幣月 K
const data = await getStockChart({ symbol: 'BTC-USD', range: '1mo', interval: '1d' })

// 自訂日期區間（Unix timestamp）
const data = await getStockChart({ symbol: 'TSLA', period1: 1704067200, period2: 1735689600, interval: '1d' })

// 繪製 K 線圖（OHLCV）
const candles = data.timestamps.map((ts, i) => ({
  time: ts,
  open: data.open[i],
  high: data.high[i],
  low: data.low[i],
  close: data.close[i],
  volume: data.volume[i],
}))
```

---

## 演唱會類 (Concerts)

### `getConcerts`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/concerts` |
| **說明** | 取得演唱會列表，支援分頁、狀態篩選與關鍵字搜尋 |
| **認證** | 不需要 |

**Query Parameters**

| 名稱 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `page` | `integer` | ❌ | `1` | 分頁頁碼 |
| `limit` | `integer` | ❌ | `10` | 每頁顯示筆數 |
| `status` | `string` | ❌ | — | 狀態篩選：`upcoming` \| `onsale` \| `soldout` \| `ended` |
| `keyword` | `string` | ❌ | — | 依演唱會名稱或藝人搜尋 |

**回傳值 `data`**

```typescript
{
  list: ConcertItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface Venue {
  name: string      // 場館名稱
  address: string   // 場館完整地址
  city: string      // 城市
  capacity: number  // 最大容納人數
}

interface Ticket {
  type: string      // 票種代碼（如 VIP、A、B、C）
  name: string      // 票種顯示名稱
  price: string     // 票價（新台幣，字串）
  quantity: number  // 此票種總張數
  available: number // 剩餘可購張數
}

interface ConcertItem {
  concertId: string       // 演唱會唯一識別碼（CUID）
  title: string           // 演唱會名稱
  artist: string          // 表演藝人或樂團名稱
  venue: Venue            // 場館資訊
  organizer: string       // 主辦公司或組織
  performanceDate: string // 演出開始時間（ISO8601）
  saleStartDate: string   // 售票開始時間（ISO8601）
  saleEndDate: string     // 售票截止時間（ISO8601）
  description: string     // 演唱會詳細介紹
  imageUrl: string        // 海報圖片 URL
  tickets: Ticket[]       // 票種列表
  status: string          // 狀態：upcoming=即將開賣 | onsale=販售中 | soldout=售完 | ended=已結束
  createdAt: string       // 建立時間
  updatedAt: string       // 更新時間
}
```

**使用範例**

```typescript
const data = await getConcerts({ page: 1, status: 'onsale', keyword: '五月天' })
const concerts = data.list
```

---

### `createConcert`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `POST /v1/api/concerts` |
| **說明** | 新增演唱會 |
| **認證** | Bearer Token 必填 |

**Request Body**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `title` | `string` | ✅ | 演唱會名稱 |
| `artist` | `string` | ✅ | 表演者 |
| `venue` | `object` | ✅ | 場館資訊（含 `name`, `address`, `city`, `capacity`） |
| `organizer` | `string` | ✅ | 主辦單位 |
| `performanceDate` | `string` | ✅ | 演出時間（ISO8601） |
| `saleStartDate` | `string` | ✅ | 售票開始時間（ISO8601） |
| `saleEndDate` | `string` | ✅ | 售票截止時間（ISO8601） |
| `description` | `string` | ✅ | 演唱會說明 |
| `tickets` | `Ticket[]` | ✅ | 票券列表（含 `type`, `name`, `price`, `quantity`, `available`） |
| `imageUrl` | `string` | ❌ | 海報 URL |
| `status` | `string` | ❌ | 狀態：`upcoming` \| `onsale` \| `soldout` \| `ended` |

**回傳值 `data`**

```typescript
ConcertItem  // 同 getConcerts 的 ConcertItem 結構
```

---

### `getConcertById`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /v1/api/concerts/{concertId}` |
| **說明** | 取得單一演唱會詳情（含完整票種資訊） |
| **認證** | 不需要 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `concertId` | `string` | ✅ | 演唱會唯一識別碼（CUID） |

**回傳值 `data`**

```typescript
ConcertItem  // 同 getConcerts 的 ConcertItem 結構
```

---

### `updateConcert`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `PUT /v1/api/concerts/{concertId}` |
| **說明** | 更新演唱會資訊（部分更新） |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `concertId` | `string` | ✅ | 演唱會唯一識別碼 |

**Request Body**（所有欄位皆選填）

| 名稱 | 型別 | 說明 |
|------|------|------|
| `title` | `string` | 演唱會名稱 |
| `artist` | `string` | 表演者 |
| `venue` | `object` | 場館資訊 |
| `organizer` | `string` | 主辦單位 |
| `performanceDate` | `string` | 演出時間（ISO8601） |
| `saleStartDate` | `string` | 售票開始時間（ISO8601） |
| `saleEndDate` | `string` | 售票截止時間（ISO8601） |
| `description` | `string` | 演唱會說明 |
| `imageUrl` | `string` | 海報 URL |
| `tickets` | `Ticket[]` | 票券列表 |
| `status` | `string` | 狀態 |

**回傳值 `data`**

```typescript
ConcertItem  // 更新後的完整演唱會資料
```

---

### `deleteConcert`

| 項目 | 說明 |
|------|------|
| **Endpoint** | `DELETE /v1/api/concerts/{concertId}` |
| **說明** | 刪除指定演唱會 |
| **認證** | Bearer Token 必填 |

**Path Parameters**

| 名稱 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `concertId` | `string` | ✅ | 演唱會唯一識別碼 |

**回傳值 `data`**

```typescript
null
```

---

## 其他

### Health Check

| 項目 | 說明 |
|------|------|
| **Endpoint** | `GET /health` |
| **說明** | 服務健康檢查，確認 API Server 是否正常運行 |
| **認證** | 不需要 |

---

## 快速索引

| Function 名稱 | Endpoint | 認證 |
|---------------|----------|------|
| `login` | `POST /v1/api/user/login` | 無 |
| `logout` | `POST /v1/api/user/logout` | Bearer |
| `getUserInfo` | `GET /v1/api/user/info` | Bearer |
| `updateUserInfo` | `PUT /v1/api/user/info` | Bearer |
| `getGames` | `GET /v1/api/games` | 無 |
| `createGame` | `POST /v1/api/games` | Bearer |
| `getGameById` | `GET /v1/api/games/{gameId}` | 無 |
| `updateGame` | `PUT /v1/api/games/{gameId}` | Bearer |
| `deleteGame` | `DELETE /v1/api/games/{gameId}` | Bearer |
| `getBooks` | `GET /v1/api/books` | 無 |
| `createBook` | `POST /v1/api/books` | Bearer |
| `getBookById` | `GET /v1/api/books/{bookId}` | 無 |
| `updateBook` | `PUT /v1/api/books/{bookId}` | Bearer |
| `deleteBook` | `DELETE /v1/api/books/{bookId}` | Bearer |
| `getMemberLevels` | `GET /v1/api/member-levels` | 無 |
| `createMemberLevel` | `POST /v1/api/member-levels` | Bearer |
| `getMemberLevelById` | `GET /v1/api/member-levels/{levelId}` | 無 |
| `updateMemberLevel` | `PUT /v1/api/member-levels/{levelId}` | Bearer |
| `deleteMemberLevel` | `DELETE /v1/api/member-levels/{levelId}` | Bearer |
| `getStockChart` | `GET /v1/api/stock/chart/{symbol}` | 無 |
| `getConcerts` | `GET /v1/api/concerts` | 無 |
| `createConcert` | `POST /v1/api/concerts` | Bearer |
| `getConcertById` | `GET /v1/api/concerts/{concertId}` | 無 |
| `updateConcert` | `PUT /v1/api/concerts/{concertId}` | Bearer |
| `deleteConcert` | `DELETE /v1/api/concerts/{concertId}` | Bearer |

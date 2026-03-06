# api-server 開發規範

Fastify v5 + Prisma + TypeScript RESTful API。
Port：3001 | Zeabur 觸發分支：`dev`

## 技術棧

- **框架**：Fastify v5（ESM，`"type": "module"`）
- **ORM**：Prisma 6（PostgreSQL）
- **認證**：`@fastify/jwt`，preHandler 用 `(app as any).authenticate`
- **API 文件**：`@fastify/swagger` + `@fastify/swagger-ui`（路徑：`/docs`）
- **測試**：vitest 2.x（整合測試，`app.inject()`）

## Response 格式

所有 API 統一回傳：

```typescript
{ code: number, msg: string, data: T | null }
```

成功：`{ code: 200, msg: 'OK', data: ... }`
失敗：`{ code: 404, msg: '資源不存在', data: null }`（同時設定 `reply.status(404)`）

## Swagger Schema 格式（YAPI 格式）

每個欄位必須包含 `mock`、`title`、`description`：

```typescript
name: {
  type: 'string',
  mock: { mock: '黃金會員' },
  title: '等級名稱',
  description: '會員等級的顯示名稱'
}
```

## Prisma Decimal 格式化

Decimal 型別不能用 `.toString()`（會掉尾數零），必須用 `.toFixed()`：

```typescript
// ❌ price.toString() → "1799"（掉尾數零）
// ✅ price.toFixed(2) → "1799.00"
// ✅ rating.toFixed(1) → "9.8"
// ✅ discount.toFixed(2) → "0.85"
```

## AJV Strict Mode

Fastify 建立時必須加 `ajv: { customOptions: { strict: false } }`，
否則 YAPI 格式的 `mock` 關鍵字會被 AJV 拒絕：

```typescript
const app = Fastify({
  logger: true,
  ajv: { customOptions: { strict: false } },
})
```

測試的 `buildApp()` helper 也需要同樣設定。

## 路由結構

每個資源群組放在 `src/routes/{resource}.ts`，在 `src/index.ts` 統一 `register`。

需要認證的路由加上：
```typescript
preHandler: [(app as any).authenticate]
```

## 資料庫指令

```bash
pnpm db:migrate:dev   # 建立新遷移（開發）
pnpm db:migrate       # 套用遷移（生產）
pnpm db:seed          # 填入 Seed 資料
pnpm db:generate      # 重新產生 Prisma Client
```

## 測試規範

測試放在 `src/routes/{resource}.test.ts`，使用 `app.inject()` 做整合測試：

```typescript
// 建立測試 app
const app = await buildApp()  // src/test/helpers.ts

// 需要認證的測試
const token = await loginAsDemo(app)
const res = await app.inject({
  method: 'POST',
  url: '/v1/api/games',
  headers: { authorization: `Bearer ${token}` },
  payload: { ... }
})
```

**執行測試**：
```bash
pnpm test              # 全部跑一次（50 個測試）
pnpm test:watch        # 監視模式
npx vitest run --reporter=html  # 產生 HTML 報告
```

## Zeabur 部署

| 項目 | 設定 |
|------|------|
| Service ID | `69a721f0e10515e35593d7bb` |
| 觸發分支 | `dev` |
| ZBPACK_ROOT_DIRECTORY | `apps/api-server` |
| PostgreSQL | `69a720b3ebec607bb566eb3f` |

**zbpack.json 說明**：
```json
{
  "build_command": "npx prisma generate && npx tsc",
  "start_command": "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/index.js"
}
```
> Zeabur builder 已自動執行 `yarn install`，build_command 只需產生 Prisma Client + 編譯 TS。

## 禁止修改

- `prisma/schema.prisma` 的 Model 主鍵策略（除非有新需求）
- `src/plugins/` 的認證邏輯（jwt、swagger 設定）

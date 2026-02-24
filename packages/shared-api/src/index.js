// ─────────────────────────────────────────────
// HTTP Client（通用工具）
// ─────────────────────────────────────────────
export { createHttpClient } from './http-client/index.js'
export {
  createRequestInterceptor,
  createResponseInterceptor,
  createResponseErrorInterceptor,
} from './http-client/interceptors.js'

// ─────────────────────────────────────────────
// 注意：
// Services 和 Schemas 已移除
// 各 app 應在本地定義自己的業務邏輯
// ─────────────────────────────────────────────
// 範例：
// apps/vue-app/src/api/services/user.js
// apps/nuxt-app/composables/api/useUser.ts
// apps/nuxt-app/schemas/user.schema.ts
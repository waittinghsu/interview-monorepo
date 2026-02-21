// HTTP Client（通用工具）
export { createHttpClient, createRequestInterceptor, createResponseInterceptor } from './http-client/index.js'

// Schemas（可選，各 app 可自行定義）
export * from './schemas/index.js'

// 注意：Services 已移除，各 app 應在本地定義自己的 service
// 例如：apps/vue-app/src/api/services/user.js
/**
 * 開發環境設定
 *
 * 【Vue 對比】
 * Vue + Vite 使用 .env 檔案來管理環境變數：
 *   .env.development → VITE_API_BASE_URL=http://localhost:3001
 *   .env.production  → VITE_API_BASE_URL=/api
 *   存取方式：import.meta.env.VITE_API_BASE_URL
 *
 * Angular 使用 TypeScript 檔案來管理環境設定：
 *   environment.ts      → 開發環境（預設）
 *   environment.prod.ts → 生產環境
 *   存取方式：import { environment } from '@env/environment';
 *
 * Angular 在建置時透過 angular.json 的 fileReplacements 設定，
 * 自動將 environment.ts 替換為 environment.prod.ts。
 * 這比 .env 的方式更有型別安全，因為是 TypeScript 物件。
 *
 * 缺點是新增環境變數需要同時修改兩個檔案，
 * 而且無法在不重新建置的情況下更改設定。
 */
export const environment = {
  /** 是否為生產環境 */
  production: false,

  /** API 基底 URL */
  apiBaseUrl: 'http://localhost:3001',
};

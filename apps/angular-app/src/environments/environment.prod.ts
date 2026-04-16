/**
 * 生產環境設定
 *
 * 建置時 Angular CLI 會根據 angular.json 中的 fileReplacements 設定，
 * 自動將 environment.ts 替換為這個檔案。
 *
 * 【Vue 對比】
 * 對應 Vue 的 .env.production 檔案。
 * Vue 建置時 Vite 會自動載入對應的 .env 檔案。
 */
export const environment = {
  /** 是否為生產環境 */
  production: true,

  /** API 基底 URL（生產環境使用相對路徑，由 reverse proxy 處理） */
  apiBaseUrl: '/api',
};

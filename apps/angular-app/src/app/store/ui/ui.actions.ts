/**
 * UI Store — Actions（UI 狀態動作）
 *
 * ============================================================
 * 【Vue 對比】UI 狀態管理
 * ============================================================
 *
 * 在 Vue 專案中，全域 UI 狀態通常放在一個專用的 Pinia store：
 *
 *   // Vue（stores/apiLoading.ts）
 *   const useApiLoadingStore = defineStore('apiLoading', {
 *     state: () => ({ isLoading: false }),
 *     actions: {
 *       setLoading(val) { this.isLoading = val }
 *     }
 *   })
 *
 * 或者用更簡單的 reactive 物件 / event bus：
 *   // Vue（api/loading.js）— loadingBus
 *   export const loadingBus = reactive({ active: 0 })
 *
 * Angular 用 NgRx 來管理，把「設定 loading」、「顯示錯誤」等
 * 都定義為 Action，確保所有 UI 狀態變更可追蹤。
 * ============================================================
 */

import { createAction, props } from '@ngrx/store';

/**
 * 設定全域 loading 狀態
 *
 * 由 LoadingInterceptor 在 HTTP 請求開始/結束時 dispatch。
 *
 * 【Vue 對比】
 * Vue 版本用 Axios interceptor + loadingBus：
 *   request: () => { loadingBus.active++ }
 *   response: () => { loadingBus.active-- }
 */
export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ isLoading: boolean }>(),
);

/**
 * 顯示錯誤訊息
 *
 * 【Vue 對比】
 * Vue 通常用 UI 框架的通知元件：
 *   Notify.create({ type: 'negative', message: '...' })
 */
export const showError = createAction(
  '[UI] Show Error',
  props<{ message: string }>(),
);

/**
 * 清除錯誤訊息
 */
export const clearError = createAction('[UI] Clear Error');

/**
 * 統一匯出命名空間
 */
export const UiActions = {
  setLoading,
  showError,
  clearError,
};

/**
 * UI Store — Reducer（UI 狀態歸約器）
 *
 * ============================================================
 * 【Vue 對比】集中式 UI 狀態 vs 分散式 reactive
 * ============================================================
 *
 * Angular（NgRx）把所有 UI 狀態集中在一個 reducer 中管理。
 * Vue 的做法更靈活，可以用 Pinia store、reactive 物件、或 provide/inject。
 *
 * 這個 reducer 管理：
 * - isLoading：全域 loading 狀態（顯示/隱藏 loading bar）
 * - errorMessage：全域錯誤訊息（顯示/隱藏錯誤提示）
 *
 * 【Vue 對比】
 *   // Pinia store
 *   const useApiLoadingStore = defineStore('apiLoading', {
 *     state: () => ({
 *       isLoading: false,
 *       errorMessage: null,
 *     })
 *   })
 *
 *   // 或用 reactive（更輕量）
 *   export const uiState = reactive({
 *     isLoading: false,
 *     errorMessage: null,
 *   })
 * ============================================================
 */

import { createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';

/**
 * UI State 介面
 */
export interface UiState {
  /** 是否正在載入（HTTP 請求進行中） */
  isLoading: boolean;
  /** 錯誤訊息（null 表示沒有錯誤） */
  errorMessage: string | null;
}

/**
 * 初始狀態
 */
export const initialUiState: UiState = {
  isLoading: false,
  errorMessage: null,
};

/**
 * UI Reducer
 *
 * 【Vue 對比】
 * 每個 on() 對應 Pinia 的一個 action / mutation：
 *
 *   setLoading  → this.isLoading = val
 *   showError   → this.errorMessage = message
 *   clearError  → this.errorMessage = null
 */
export const uiReducer = createReducer(
  initialUiState,

  on(UiActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  })),

  on(UiActions.showError, (state, { message }) => ({
    ...state,
    errorMessage: message,
  })),

  on(UiActions.clearError, (state) => ({
    ...state,
    errorMessage: null,
  })),
);

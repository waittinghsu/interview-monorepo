/**
 * UI Store — Selectors（UI 狀態選取器）
 *
 * ============================================================
 * 【Vue 對比】Selector vs computed / storeToRefs
 * ============================================================
 *
 * 在 Vue 中，讀取 Pinia store 的值有兩種方式：
 *
 *   // 方式 1：直接存取（有響應性）
 *   const loadingStore = useApiLoadingStore()
 *   loadingStore.isLoading  // 在 template 中自動追蹤
 *
 *   // 方式 2：storeToRefs（解構時保持響應性）
 *   const { isLoading } = storeToRefs(loadingStore)
 *
 * Angular（NgRx）用 Selector + store.select()：
 *   this.isLoading$ = this.store.select(selectIsLoading)
 *
 * Selector 回傳的是 Observable（串流），
 * 在元件 template 中用 async pipe 訂閱：
 *   <div *ngIf="isLoading$ | async">Loading...</div>
 *
 * 【Vue 對比】
 *   <div v-if="isLoading">Loading...</div>
 *   Vue 直接綁定響應式變數，Angular 需要 async pipe 處理 Observable。
 * ============================================================
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.reducer';

/**
 * Feature Selector — 選取 UI slice
 */
const selectUiState = createFeatureSelector<UiState>('ui');

/**
 * 選取 loading 狀態
 *
 * 【Vue 對比】
 *   const { isLoading } = storeToRefs(useApiLoadingStore())
 */
export const selectIsLoading = createSelector(
  selectUiState,
  (state) => state.isLoading,
);

/**
 * 選取錯誤訊息
 *
 * 【Vue 對比】
 *   const errorMessage = computed(() => uiStore.errorMessage)
 */
export const selectErrorMessage = createSelector(
  selectUiState,
  (state) => state.errorMessage,
);

/**
 * Theme Store — Reducer（主題狀態歸約器）
 *
 * ============================================================
 * 【Vue 對比】主題 state 管理
 * ============================================================
 *
 * Vue 版本用 Pinia store 管理主題名稱：
 *
 *   // stores/theme.js
 *   const useThemeStore = defineStore('theme', {
 *     state: () => ({
 *       currentTheme: 'cyberpunk',  // 對應 NgRx 的 name
 *     })
 *   })
 *
 * Angular 版本用 NgRx Reducer：
 *   - name：當前主題名稱（固定為 'seoul-editorial'）
 *   - applied：是否已套用到 DOM（Vue 不需要這個欄位）
 *
 * Angular 的「seoul-editorial」主題是專為此 App 設計的。
 * Vue 版本使用 shared-design-tokens 的主題（cyberpunk 等）。
 * ============================================================
 */

import { createReducer, on } from '@ngrx/store';
import { ThemeActions } from './theme.actions';

/**
 * Theme State 介面
 */
export interface ThemeState {
  /** 主題名稱 */
  name: string;
  /** 是否已套用到 DOM */
  applied: boolean;
}

/**
 * 初始狀態
 *
 * 預設主題：seoul-editorial（首爾編輯風格）
 */
export const initialThemeState: ThemeState = {
  name: 'seoul-editorial',
  applied: false,
};

/**
 * Theme Reducer
 *
 * 【Vue 對比】
 * Vue 的 themeStore 通常只有一個 setTheme action，
 * 直接修改 currentTheme state。
 *
 * NgRx 分成兩步：
 * 1. applyTheme → 不修改 state（由 Effect 處理 DOM 操作）
 * 2. themeApplied → 標記 applied: true（確認套用完成）
 */
export const themeReducer = createReducer(
  initialThemeState,

  /**
   * 主題套用完成 → 標記 applied: true
   *
   * 【Vue 對比】
   * Vue 不需要這個步驟，因為 reactive state 的更新是同步的。
   * NgRx 用這個 action 來確認 Effect（DOM 操作）已完成。
   */
  on(ThemeActions.themeApplied, (state) => ({
    ...state,
    applied: true,
  })),
);

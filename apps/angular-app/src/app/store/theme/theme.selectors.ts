/**
 * Theme Store — Selectors（主題選取器）
 *
 * ============================================================
 * 【Vue 對比】主題 Selector vs computed
 * ============================================================
 *
 * Vue 中讀取主題：
 *   const themeStore = useThemeStore()
 *   const currentTheme = computed(() => themeStore.currentTheme)
 *   // 或直接在 template 中：{{ themeStore.currentTheme }}
 *
 * Angular 中讀取主題：
 *   this.themeName$ = this.store.select(selectThemeName)
 *   // 在 template 中：{{ themeName$ | async }}
 * ============================================================
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from './theme.reducer';

/**
 * Feature Selector — 選取 Theme slice
 */
const selectThemeState = createFeatureSelector<ThemeState>('theme');

/**
 * 選取主題名稱
 *
 * 【Vue 對比】
 *   const currentTheme = computed(() => themeStore.currentTheme)
 */
export const selectThemeName = createSelector(
  selectThemeState,
  (state) => state.name,
);

/**
 * 選取主題是否已套用
 *
 * 【Vue 對比】
 * Vue 不需要這個 selector，因為 CSS 變數設定是同步操作。
 * Angular 用它來確認主題 Effect 已完成 DOM 操作。
 */
export const selectThemeApplied = createSelector(
  selectThemeState,
  (state) => state.applied,
);

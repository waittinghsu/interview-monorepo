/**
 * Theme Store — Effects（主題副作用處理）
 *
 * ============================================================
 * 【Vue 對比】CSS 變數套用 — Effect vs Pinia action
 * ============================================================
 *
 * Vue 版本在 Pinia action 中直接操作 DOM：
 *
 *   // stores/theme.js
 *   setTheme(name) {
 *     this.currentTheme = name
 *     const theme = themes[name]
 *     const root = document.documentElement
 *     Object.entries(theme).forEach(([key, value]) => {
 *       root.style.setProperty(`--${key}`, value)
 *     })
 *   }
 *
 * Angular（NgRx）版本把 DOM 操作放在 Effect 中：
 *
 *   applyTheme$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType(ThemeActions.applyTheme),
 *       tap(() => { // 設定 CSS 變數 }),
 *       map(() => ThemeActions.themeApplied())
 *     )
 *   )
 *
 * 為什麼要用 Effect？
 * - Reducer 必須是「純函式」，不能操作 DOM
 * - Effect 專門處理副作用（DOM 操作、API 呼叫等）
 * - 分離關注點：state 管理 vs DOM 操作
 *
 * tap 操作符 — 執行副作用但不修改串流中的值：
 *   tap(() => console.log('side effect'))
 *   類似 Array.forEach()，但用於 Observable。
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { ThemeActions } from './theme.actions';

/**
 * Seoul Editorial 主題 — CSS 變數定義
 *
 * 這是 Angular App 專用的主題設計，
 * 靈感來自首爾的現代編輯風格（Editorial Design）。
 *
 * 【Vue 對比】
 * Vue 版本的主題定義在 packages/shared-design-tokens 中：
 *   packages/shared-design-tokens/src/themes/cyberpunk.js
 *   packages/shared-design-tokens/src/themes/dark-green.js
 *
 * Angular 版本不使用 shared-design-tokens，
 * 而是在 Effect 中直接定義（因為主題風格完全不同）。
 */
const SEOUL_EDITORIAL_THEME: Record<string, string> = {
  // ── 頁面基礎 ──
  'sys-page': '#faf9f7',
  'sys-card': '#ffffff',
  'sys-raised': '#f5f3f0',
  'sys-border': '#e8e4de',
  'sys-border-strong': '#d4cfc7',

  // ── 文字層級 ──
  'text-base': '#1a1a1a',
  'text-secondary': '#6b6560',
  'text-muted': '#a09890',
  'text-brand': '#c8102e',
  'text-inverse': '#faf9f7',

  // ── 品牌色（韓國國旗紅） ──
  'color-primary': '#c8102e',
  'color-primary-light': '#e8344f',
  'color-primary-dark': '#9e0c24',
  'color-secondary': '#1a1a1a',

  // ── 功能色 ──
  'color-success': '#2d8659',
  'color-warning': '#d4a039',
  'color-error': '#c8102e',
  'color-info': '#3a7bc8',

  // ── 漸層 ──
  'gradient-primary-from': '#c8102e',
  'gradient-primary-to': '#1a1a1a',
};

@Injectable()
export class ThemeEffects {
  constructor(private readonly actions$: Actions) {}

  /**
   * Effect：套用主題 CSS 變數
   *
   * 監聽 applyTheme action → 設定 CSS 變數到 document → dispatch themeApplied
   *
   * 【Vue 對比】
   * Vue 版本在 Pinia action 中直接操作：
   *   const root = document.documentElement
   *   root.style.setProperty('--sys-page', '#1a1a2e')
   *
   * Angular 把 DOM 操作隔離在 Effect 中，
   * 確保 Reducer 保持純函式，不接觸 DOM。
   *
   * tap()：執行副作用（設定 CSS 變數）
   * map()：轉換為 themeApplied action（通知 Reducer 主題已套用）
   */
  applyTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.applyTheme),
      tap(() => {
        const root = document.documentElement;
        Object.entries(SEOUL_EDITORIAL_THEME).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }),
      map(() => ThemeActions.themeApplied()),
    ),
  );
}

/**
 * Store 根設定 — 集中匯出所有 NgRx 相關模組
 *
 * ============================================================
 * 【Vue 對比】NgRx Store 根設定 vs Pinia 初始化
 * ============================================================
 *
 * Pinia 的初始化非常簡單：
 *   // main.js
 *   import { createPinia } from 'pinia'
 *   app.use(createPinia())
 *   // 然後各 store 用 defineStore() 各自定義，不需要集中註冊
 *
 * NgRx 需要在根模組集中註冊所有 reducer 和 effect：
 *   // app.module.ts
 *   StoreModule.forRoot(reducers)
 *   EffectsModule.forRoot([KpopEffects, ThemeEffects])
 *
 * ActionReducerMap<AppState> — 定義整個應用的 state 結構：
 *   { kpop: KpopState, ui: UiState, theme: ThemeState }
 *
 * 每個 key 對應一個 reducer 函式，
 * NgRx 會自動組合它們成為一個完整的 state 樹。
 *
 * 【Vue 對比】
 * Pinia 的每個 store 是獨立的（不需要集中註冊），
 * 但 NgRx 要求明確定義完整的 state 結構。
 * 這讓 TypeScript 可以完整推斷整個應用的 state 型別。
 * ============================================================
 */

import { ActionReducerMap } from '@ngrx/store';
import { kpopReducer, KpopState } from './kpop/kpop.reducer';
import { uiReducer, UiState } from './ui/ui.reducer';
import { themeReducer, ThemeState } from './theme/theme.reducer';

/**
 * 應用程式的完整 State 介面
 *
 * 【Vue 對比】
 * Pinia 沒有統一的 AppState 介面。
 * 各 store 各自獨立，用 useXxxStore() 取得：
 *   const kpopStore = useKpopStore()
 *   const uiStore = useUiStore()
 *   const themeStore = useThemeStore()
 *
 * NgRx 有一個統一的 AppState，所有資料都在裡面：
 *   this.store.select(state => state.kpop.companies)
 */
export interface AppState {
  kpop: KpopState;
  ui: UiState;
  theme: ThemeState;
}

/**
 * Reducer 映射表 — 告訴 NgRx 每個 state slice 由哪個 reducer 管理
 *
 * 【Vue 對比】
 * Pinia 不需要這個映射表，因為每個 store 自動是 singleton。
 * NgRx 需要明確註冊，確保：
 * 1. TypeScript 能推斷完整的 state 型別
 * 2. DevTools 能追蹤所有 state 變更
 * 3. 不會遺漏或重複註冊
 */
export const reducers: ActionReducerMap<AppState> = {
  kpop: kpopReducer,
  ui: uiReducer,
  theme: themeReducer,
};

// 匯出所有 store 相關的型別和常數，方便其他模組使用
export { KpopState } from './kpop/kpop.reducer';
export { UiState } from './ui/ui.reducer';
export { ThemeState } from './theme/theme.reducer';

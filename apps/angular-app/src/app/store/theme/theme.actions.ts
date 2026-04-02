/**
 * Theme Store — Actions（主題動作）
 *
 * ============================================================
 * 【Vue 對比】主題切換機制
 * ============================================================
 *
 * Vue 版本的主題切換：
 *   // stores/theme.js
 *   const useThemeStore = defineStore('theme', {
 *     state: () => ({ currentTheme: 'cyberpunk' }),
 *     actions: {
 *       setTheme(name) {
 *         this.currentTheme = name
 *         applyThemeCSS(name)  // 副作用直接寫在 action 裡
 *       }
 *     }
 *   })
 *
 * Angular（NgRx）版本：
 *   dispatch(applyTheme) → Effect(套用 CSS 變數) → dispatch(themeApplied)
 *
 * 差異：
 * - Vue 在 action 中同時處理 state 更新和副作用（DOM 操作）
 * - NgRx 把 state 更新（Reducer）和副作用（Effect）分開
 * - NgRx 的 themeApplied action 讓我們確認主題已成功套用
 * ============================================================
 */

import { createAction } from '@ngrx/store';

/**
 * 套用主題
 *
 * 觸發時機：App 初始化時
 * 處理者：ThemeEffects.applyTheme$
 *
 * 【Vue 對比】
 * Vue 在 App.vue 的 onMounted 或 watch 中呼叫：
 *   onMounted(() => themeStore.setTheme('cyberpunk'))
 *
 * Angular 在 AppComponent.ngOnInit 中 dispatch：
 *   this.store.dispatch(ThemeActions.applyTheme())
 */
export const applyTheme = createAction('[Theme] Apply Theme');

/**
 * 主題套用完成
 *
 * 由 Effect 在 CSS 變數設定完成後 dispatch。
 * 用於確認主題已成功套用（可在 DevTools 中追蹤）。
 *
 * 【Vue 對比】
 * Vue 不需要這個步驟，因為 DOM 操作是同步的，
 * 在 setTheme() 結束時主題就已經套用完成了。
 */
export const themeApplied = createAction('[Theme] Theme Applied');

/**
 * 統一匯出命名空間
 */
export const ThemeActions = {
  applyTheme,
  themeApplied,
};

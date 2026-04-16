/**
 * Theme Slice
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue（Pinia）：defineStore 直接定義 state + action，action 可直接 mutate
 * React（RTK）：createSlice 定義 initialState + reducers
 *   - reducer 是「純函數」：(state, action) => newState
 *   - RTK 內建 Immer，所以可以「看起來在 mutate」，底層是 immutable
 *   - 讀取 state：useSelector((state) => state.theme.initialized)
 *   - 觸發 action：dispatch(initTheme())
 * ──────────────────────────────────────────────────────────────
 *
 * 此 slice 負責：
 * 1. 追蹤主題是否已初始化（避免重複套用 CSS 變數）
 * 2. 提供 initTheme action（套用 Midnight Seoul 主題到 document）
 */

import { createSlice } from '@reduxjs/toolkit'

// ── Midnight Seoul 色彩 Token ──────────────────────────────────
// 這裡定義色彩常數，讓 JS 邏輯也能存取相同的值
// Vue 對應：shared-design-tokens 的 cyberpunkTheme.colors
const midnightSeoulColors = {
  'bg-base': '#0d0d12',
  'bg-card': '#16161f',
  'bg-raised': '#1e1e2e',
  'color-primary': '#FF6B8A',
  'color-secondary': '#A78BFA',
  'text-base': '#F0EEF8',
  'text-secondary': '#B8B7CC',
  'text-muted': '#8B8AA8',
  'border': 'rgba(255, 255, 255, 0.06)',
}

/**
 * 將色彩 token 套用到 document root 的 CSS 變數
 * Vue 對應：themeStore 的 applyTheme(theme)
 *
 * @param {Record<string, string>} colors
 */
function applyThemeToDOM(colors) {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
  // 同步更新 body 背景色（確保全頁覆蓋）
  if (colors['bg-base']) {
    document.body.style.backgroundColor = colors['bg-base']
  }
  if (colors['text-base']) {
    document.body.style.color = colors['text-base']
  }
}

// ── Slice 定義 ─────────────────────────────────────────────────
const themeSlice = createSlice({
  name: 'theme',

  // initialState：Redux store 的初始狀態
  // Vue 對應：Pinia defineStore 中 ref() 的初始值
  initialState: {
    initialized: false,
    currentTheme: 'midnight-seoul',
  },

  // reducers：定義「如何回應 action 來改變 state」
  // Vue 對應：Pinia 的 action 函數（但這裡是純函數，不能有副作用）
  reducers: {
    /**
     * initTheme：套用主題
     * 注意：Redux reducer 應該是 pure function（無副作用）
     * 但這裡用 RTK 的 prepare callback 分離副作用，
     * 更簡單的做法是在 React 元件的 useEffect 內直接呼叫 applyThemeToDOM
     */
    initTheme: (state) => {
      // Immer 讓我們可以「直接 mutate」state（底層自動產生新物件）
      state.initialized = true
      // 副作用（DOM 操作）放在 reducer 外——這裡簡化處理，直接在此呼叫
      applyThemeToDOM(midnightSeoulColors)
    },
  },
})

// ── 導出 action creators（RTK 自動生成）──────────────────────
// Vue 對應：直接呼叫 store.initTheme()
// React 用法：dispatch(initTheme())
export const { initTheme } = themeSlice.actions

// ── 導出 selectors（從 state 讀取資料的函數）────────────────
// Vue 對應：storeToRefs(useThemeStore()).initialized
// React 用法：const initialized = useSelector(selectThemeInitialized)
export const selectThemeInitialized = (state) => state.theme.initialized

export default themeSlice.reducer

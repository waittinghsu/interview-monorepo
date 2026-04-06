/**
 * Redux Store 設定
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue（Pinia）：createPinia() 建立全域 store，在 main.js app.use(pinia)
 * React（RTK）：configureStore 整合所有 reducer，包在 <Provider store={store}>
 *
 * 多個 slice 時：
 *   reducer: {
 *     theme: themeReducer,
 *     user: userReducer,    // 未來擴充
 *     cart: cartReducer,    // 未來擴充
 *   }
 * ──────────────────────────────────────────────────────────────
 */

import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'

const store = configureStore({
  reducer: {
    // key 對應 useSelector((state) => state.theme)
    theme: themeReducer,
  },
  // Redux DevTools Extension 在開發模式自動啟用
  // 安裝瀏覽器擴充套件後可以看到所有 action 的時間旅行
  devTools: import.meta.env.DEV,
})

export default store

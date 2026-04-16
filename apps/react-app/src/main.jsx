/**
 * 應用程式入口
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue main.js：createApp(App).use(router).use(pinia).mount('#app')
 * React main.jsx：createRoot(el).render(<Providers><App /></Providers>)
 *
 * React 使用 JSX Provider 模式包裹，而非 .use() 鏈式呼叫
 * 每個 Provider 都是一個 React Context，提供全域資料給子元件
 * ──────────────────────────────────────────────────────────────
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from '@/store'
import App from './App'
import '@/styles/index.css'

// createRoot：React 18+ 的掛載方式（取代 ReactDOM.render）
// '#root' 對應 index.html 的 <div id="root">
createRoot(document.getElementById('root')).render(
  // StrictMode：開發模式下故意執行兩次副作用，幫助發現問題
  // Vue 沒有對應概念，這是 React 特有的開發輔助工具
  <StrictMode>
    {/* Provider：將 Redux store 注入整個應用，
        任何子元件都可以用 useSelector/useDispatch 存取 */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

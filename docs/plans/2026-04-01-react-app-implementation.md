# react-app Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 monorepo 的 `apps/react-app` 建立一個 K-Pop Hub React 應用，功能與 vue-app 一致，風格使用 Midnight Seoul 設計語言，並附有詳細中文對比註解供 Vue 開發者學習。

**Architecture:** React 19 + Vite 6 SPA，使用 React Router v7 管理路由，Redux Toolkit 管理主題狀態，Tailwind CSS v4 + CSS Variables 實作 Midnight Seoul 深色主題，Framer Motion 處理動畫。靜態資料直接從 kpop.js 讀取，無後端依賴。

**Tech Stack:** React 19, Vite 6, React Router v7, Redux Toolkit, Tailwind CSS v4, Framer Motion, Axios, pnpm workspace

---

## Task 1：建立專案基礎骨架

**Files:**
- Create: `apps/react-app/package.json`
- Create: `apps/react-app/index.html`
- Create: `apps/react-app/vite.config.js`
- Create: `apps/react-app/eslint.config.js`
- Create: `apps/react-app/.gitignore`
- Modify: `package.json`（根目錄，新增 dev:react script）

**Step 1: 建立 apps/react-app/package.json**

```json
{
  "name": "@interview/react-app",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.3.0",
    "axios": "1.7.9",
    "framer-motion": "^11.12.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-redux": "^9.1.0",
    "react-router": "^7.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.10.0",
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.10.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "globals": "^15.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0"
  }
}
```

**Step 2: 建立 apps/react-app/index.html**

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Fonts: Bebas Neue（大標題）+ Plus Jakarta Sans（內文） -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>K-Pop Hub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 3: 建立 apps/react-app/vite.config.js**

```javascript
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // '@' 別名對應 src 目錄，和 vue-app 一致
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173, // 不與 vue-app(9527) 衝突
    open: false,
  },
})
```

**Step 4: 建立 apps/react-app/eslint.config.js**

```javascript
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      // React 17+ 不需要在每個檔案 import React，關閉此規則
      'react/react-in-jsx-scope': 'off',
      // 強制 hooks 使用規則（只能在元件頂層、只能在函數元件內呼叫）
      'react-hooks/rules-of-hooks': 'error',
      // 警告 useEffect 的 dependencies 有遺漏（和 vue-app no-console 警告策略一致）
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
]
```

**Step 5: 建立 apps/react-app/.gitignore**

```
node_modules/
dist/
.env
.env.local
```

**Step 6: 在根目錄 package.json 新增 dev:react script**

在 `package.json` 的 scripts 物件中新增：
```json
"dev:react": "turbo run dev --filter=@interview/react-app"
```

**Step 7: 安裝依賴**

```bash
cd /path/to/monorepo/root
pnpm install
```

Expected: 完成安裝，`apps/react-app/node_modules` 出現

**Step 8: Commit**

```bash
git add apps/react-app/package.json apps/react-app/index.html apps/react-app/vite.config.js apps/react-app/eslint.config.js apps/react-app/.gitignore package.json
git commit -m "chore: scaffold react-app with Vite + RTK + Tailwind v4"
```

---

## Task 2：Tailwind CSS + Midnight Seoul 主題

**Files:**
- Create: `apps/react-app/src/styles/index.css`

**Step 1: 建立 src/styles/index.css**

```css
/* ===== Tailwind CSS v4 =====
 * v4 改用 CSS-first 配置方式，不再需要 tailwind.config.js
 * @import "tailwindcss" 取代 v3 的三行 @tailwind directives
 */
@import "tailwindcss";

/* ===== Google Fonts =====
 * Bebas Neue：大標題，有韓流海報感
 * Plus Jakarta Sans：內文，現代乾淨有個性
 */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* ===== Midnight Seoul 主題色彩系統 =====
 * 使用 CSS 自訂屬性（Custom Properties）= CSS Variables
 * 好處：可在 JS 中動態修改，也可用於 Tailwind 的 arbitrary values
 *
 * Vue 對應：shared-design-tokens 的 cyberpunkTheme.colors
 */
:root {
  /* 背景層次 */
  --bg-base: #0d0d12;          /* 主背景：深邃暖黑 */
  --bg-card: #16161f;          /* 卡片背景 */
  --bg-raised: #1e1e2e;        /* 浮起元素（hover 狀態等） */
  --bg-overlay: rgba(13, 13, 18, 0.85); /* 遮罩層 */

  /* 品牌色 */
  --color-primary: #FF6B8A;    /* 玫瑰珊瑚，主色 */
  --color-primary-dim: rgba(255, 107, 138, 0.15); /* 主色半透明，用於 badge 背景 */
  --color-secondary: #A78BFA;  /* 柔紫，輔色 */
  --color-secondary-dim: rgba(167, 139, 250, 0.15);

  /* 文字層次 */
  --text-base: #F0EEF8;        /* 主要文字，暖白 */
  --text-secondary: #B8B7CC;   /* 次要文字 */
  --text-muted: #8B8AA8;       /* 淡色文字 */

  /* 邊框 */
  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.12);

  /* 字型 */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}

/* ===== 全域基礎樣式 ===== */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}

body {
  background-color: var(--bg-base);
  color: var(--text-base);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* noise texture：增加質感，幾乎不可見但讓背景不死板 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ===== 捲軸樣式 ===== */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }

/* ===== Tailwind v4 自訂 utilities（對應 UnoCSS shortcuts）=====
 * @layer utilities 讓這些 class 可以被 Tailwind 的 JIT 正確處理
 */
@layer utilities {
  /* 隱藏捲軸（但可以捲動）*/
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Glassmorphism 卡片效果 */
  .glass-card {
    background: rgba(22, 22, 31, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border);
  }
}
```

**Step 2: Commit**

```bash
git add apps/react-app/src/styles/index.css
git commit -m "feat(react-app): add Midnight Seoul theme CSS variables + Tailwind v4"
```

---

## Task 3：Redux Store 設定

**Files:**
- Create: `apps/react-app/src/store/themeSlice.js`
- Create: `apps/react-app/src/store/index.js`

**Step 1: 建立 src/store/themeSlice.js**

```javascript
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
```

**Step 2: 建立 src/store/index.js**

```javascript
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
```

**Step 3: Commit**

```bash
git add apps/react-app/src/store/
git commit -m "feat(react-app): add Redux Toolkit store with theme slice"
```

---

## Task 4：應用程式入口 + Router

**Files:**
- Create: `apps/react-app/src/main.jsx`
- Create: `apps/react-app/src/router/index.jsx`
- Create: `apps/react-app/src/App.jsx`

**Step 1: 建立 src/router/index.jsx**

```jsx
/**
 * React Router v7 路由設定
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue Router：createRouter + createWebHistory + routes 陣列
 * React Router v7：createBrowserRouter（object-based config）
 *
 * 對應關係：
 *   Vue <router-view>        → React <Outlet>（在 DefaultLayout 內）
 *   Vue { path, component }  → React { path, element }
 *   Vue { children: [...] }  → React { children: [...] }（相同概念！）
 *   Vue 404: path: '/:pathMatch(.*)*' → React path: '*'
 * ──────────────────────────────────────────────────────────────
 */

import { createBrowserRouter } from 'react-router'
import DefaultLayout from '@/components/layout/DefaultLayout'
import GroupPage from '@/pages/GroupPage'
import HomePage from '@/pages/HomePage'
import MemberPage from '@/pages/MemberPage'
import NotFoundPage from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    // 父路由：使用 DefaultLayout（含 Header、Footer、Loading Bar）
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,        // index: true = Vue 的 path: ''（預設子路由）
        element: <HomePage />,
      },
      {
        path: 'group/:id',  // :id = 動態路由參數，用 useParams() 讀取
        element: <GroupPage />,
      },
      {
        path: 'member/:id',
        element: <MemberPage />,
      },
    ],
  },
  {
    path: '*',              // 萬用路徑（= Vue 的 /:pathMatch(.*)*）
    element: <NotFoundPage />,
  },
])

export default router
```

**Step 2: 建立 src/App.jsx**

```jsx
/**
 * App 根元件
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue App.vue 通常放 <RouterView>，並在這裡初始化 store
 * React App.jsx 放 <RouterProvider>（React Router v7 的根元件）
 *
 * 主題初始化：
 *   Vue：在 App.vue 的 onMounted 呼叫 themeStore.initTheme()
 *   React：在 useEffect（= onMounted）呼叫 dispatch(initTheme())
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router'
import { initTheme } from '@/store/themeSlice'
import router from '@/router'

function App() {
  // useDispatch：取得 dispatch 函數，用來觸發 Redux action
  // Vue 對應：const themeStore = useThemeStore()
  const dispatch = useDispatch()

  useEffect(() => {
    // useEffect 第二個參數 [] = 只在 mount 時執行一次
    // Vue 對應：onMounted(() => { themeStore.initTheme() })
    dispatch(initTheme())
  }, [dispatch])

  return <RouterProvider router={router} />
}

export default App
```

**Step 3: 建立 src/main.jsx**

```jsx
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
```

**Step 4: Commit**

```bash
git add apps/react-app/src/main.jsx apps/react-app/src/App.jsx apps/react-app/src/router/
git commit -m "feat(react-app): add entry point + React Router v7 config"
```

---

## Task 5：Layout 元件（DefaultLayout + AppHeader + AppFooter）

**Files:**
- Create: `apps/react-app/src/components/layout/DefaultLayout.jsx`
- Create: `apps/react-app/src/components/layout/AppHeader.jsx`
- Create: `apps/react-app/src/components/layout/AppFooter.jsx`
- Create: `apps/react-app/src/hooks/useApiLoading.js`
- Create: `apps/react-app/src/api/loading.js`

**Step 1: 建立 src/api/loading.js（直接沿用 vue-app 的設計）**

```javascript
/**
 * Loading Bus（框架無關）
 *
 * 純 JS 的 loading 計數器，不依賴 React 或 Vue。
 * 透過 subscribe 讓 React hook 訂閱狀態變化。
 *
 * 設計原則：
 *   - HTTP 攔截器呼叫 push()/pop() 計數
 *   - React 層（useApiLoading）訂閱事件，提供 useState 驅動的 isLoading
 *   - 兩層解耦，這個模組可以在任何框架使用
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * 完全相同！此檔案從 vue-app 直接移植，無需修改。
 * Vue composable 和 React custom hook 都透過 subscribe 訂閱。
 * ──────────────────────────────────────────────────────────────
 */

let pendingCount = 0
const listeners = new Set()

function notify() {
  const isLoading = pendingCount > 0
  listeners.forEach(fn => fn(isLoading, pendingCount))
}

export const loadingBus = {
  push() {
    pendingCount++
    notify()
  },
  pop() {
    pendingCount = Math.max(0, pendingCount - 1)
    notify()
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get isLoading() { return pendingCount > 0 },
  get pendingCount() { return pendingCount },
}
```

**Step 2: 建立 src/hooks/useApiLoading.js**

```javascript
/**
 * useApiLoading — 追蹤全域 HTTP loading 狀態
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：composable（useApiLoading.js）用 ref + onMounted + onUnmounted
 * React：custom hook 用 useState + useEffect
 *
 * 命名慣例：
 *   Vue composable：useXxx（返回 reactive refs）
 *   React custom hook：useXxx（返回普通值，state 變化觸發 re-render）
 *
 * 訂閱模式（兩者相同）：
 *   1. 元件 mount → subscribe
 *   2. loadingBus 通知 → 更新 state
 *   3. 元件 unmount → unsubscribe（cleanup）
 * ──────────────────────────────────────────────────────────────
 *
 * @returns {{ isLoading: boolean, pendingCount: number }}
 */

import { useEffect, useState } from 'react'
import { loadingBus } from '@/api/loading'

export function useApiLoading() {
  // useState：宣告本地狀態，[值, 更新函數]
  // Vue 對應：const isLoading = ref(loadingBus.isLoading)
  const [isLoading, setIsLoading] = useState(loadingBus.isLoading)
  const [pendingCount, setPendingCount] = useState(loadingBus.pendingCount)

  useEffect(() => {
    // ── mount：訂閱 loadingBus ──
    // Vue 對應：onMounted(() => { unsubscribe = loadingBus.subscribe(...) })
    const unsubscribe = loadingBus.subscribe((loading, count) => {
      setIsLoading(loading)
      setPendingCount(count)
    })

    // ── cleanup（unmount）：取消訂閱 ──
    // Vue 對應：onUnmounted(() => { unsubscribe?.() })
    // React useEffect：return 一個函數 = cleanup（元件銷毀時執行）
    return unsubscribe
  }, []) // [] = 只在 mount/unmount 時執行

  return { isLoading, pendingCount }
}
```

**Step 3: 建立 src/components/layout/AppHeader.jsx**

```jsx
/**
 * AppHeader — 頂部導覽列
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<router-link :to="{ name: 'Home' }">
 * React：<Link to="/">（react-router 的 Link 元件）
 *
 * Vue：const isHome = computed(() => route.name === 'Home')
 * React：const location = useLocation()
 *        const isHome = location.pathname === '/'
 *
 * Vue：router.back()
 * React：navigate(-1)（useNavigate hook 返回的函數）
 * ──────────────────────────────────────────────────────────────
 */

import { Link, useLocation, useNavigate } from 'react-router'

function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  // 判斷是否在首頁（= Vue 的 route.name === 'Home'）
  const isHome = location.pathname === '/'

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(22, 22, 31, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center min-h-[52px] px-3 max-w-[480px] mx-auto">
        {/* 返回按鈕（非首頁才顯示）— Vue 對應：v-if="!isHome" */}
        {!isHome && (
          <button
            onClick={() => navigate(-1)} // navigate(-1) = router.back()
            className="mr-2 p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="返回"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-1.5">
          {/* SVG 音符 icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18V5l12-2v13" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" fill="var(--color-primary)"/>
            <circle cx="18" cy="16" r="3" fill="var(--color-primary)" opacity="0.6"/>
          </svg>
          <span
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-base)', letterSpacing: '0.05em', fontSize: '1.1rem' }}
          >
            K-POP
          </span>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
            HUB
          </span>
        </Link>

        {/* spacer：推開右側按鈕（= Vue 的 <q-space />）*/}
        <div className="flex-1" />

        {/* 搜尋按鈕（預留） */}
        <button
          className="p-1.5 rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="搜尋"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
```

**Step 4: 建立 src/components/layout/AppFooter.jsx**

```jsx
/**
 * AppFooter — 底部列
 */

function AppFooter() {
  return (
    <footer
      className="border-t py-3"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <p className="text-center text-xs m-0" style={{ color: 'var(--text-muted)' }}>
        K-Pop Hub — 探索你喜愛的 K-pop 團體
      </p>
    </footer>
  )
}

export default AppFooter
```

**Step 5: 建立 src/components/layout/DefaultLayout.jsx**

```jsx
/**
 * DefaultLayout — 主要版面配置
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<q-layout> + <q-page-container> + <router-view>
 * React：普通 div 結構 + <Outlet>
 *
 * <Outlet>：React Router 的「插槽」，渲染目前路由對應的子頁面
 * Vue 對應：<RouterView>（完全相同的概念！）
 *
 * Loading Bar：
 *   Vue：v-if="isLoading" + <q-linear-progress>
 *   React：{isLoading && <div className="loading-bar" />}
 * ──────────────────────────────────────────────────────────────
 */

import { Outlet } from 'react-router'
import { useApiLoading } from '@/hooks/useApiLoading'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'

function DefaultLayout() {
  const { isLoading } = useApiLoading()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* 全域 Loading Bar（有 HTTP 請求進行中才顯示）*/}
      {/* Vue 對應：v-if="isLoading" */}
      {isLoading && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] h-[2px]"
          style={{ background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))` }}
        >
          {/* 動畫進度條 */}
          <div
            className="h-full animate-pulse"
            style={{ background: 'var(--color-primary)', width: '60%' }}
          />
        </div>
      )}

      <AppHeader />

      {/* 主要內容區 */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[480px] px-4 py-4">
          {/* Outlet：渲染當前路由的子頁面 = Vue 的 <RouterView> */}
          <Outlet />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default DefaultLayout
```

**Step 6: Commit**

```bash
git add apps/react-app/src/api/loading.js apps/react-app/src/hooks/ apps/react-app/src/components/layout/
git commit -m "feat(react-app): add DefaultLayout, AppHeader, AppFooter, useApiLoading"
```

---

## Task 6：靜態資料 + 首頁子元件

**Files:**
- Create: `apps/react-app/src/data/kpop.js`（從 vue-app 複製）
- Create: `apps/react-app/src/components/home/CarouselBanner.jsx`
- Create: `apps/react-app/src/components/home/CompanySlider.jsx`
- Create: `apps/react-app/src/components/home/MarqueeBanner.jsx`
- Create: `apps/react-app/src/components/group/GroupCard.jsx`

**Step 1: 複製靜態資料**

```bash
cp apps/vue-app/src/data/kpop.js apps/react-app/src/data/kpop.js
```

**Step 2: 建立 src/components/home/CarouselBanner.jsx**

```jsx
/**
 * CarouselBanner — 首頁輪播圖
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：<q-carousel v-model="currentSlide" :autoplay="4000">
 * React：自製 carousel，用 useState + useEffect 模擬 autoplay
 *
 * Vue ref 綁定：v-model="currentSlide"（雙向）
 * React state：const [current, setCurrent] = useState(0)（單向 + handler）
 *
 * 動畫：Framer Motion 的 AnimatePresence + motion.div
 *   AnimatePresence：讓「離開」的元素可以播放 exit 動畫（React 沒有 v-show 等效）
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ slides: Array<{ id, image, title, subtitle, colorFrom, colorTo }> }} props
 */

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function CarouselBanner({ slides }) {
  // 當前 slide 索引
  // Vue 對應：const currentSlide = ref(0)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1=往右, -1=往左

  // 切換到下一張
  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // 自動輪播：每 4 秒切換
  // Vue 對應：:autoplay="4000"（Quasar 內建）
  // React：useEffect + setInterval
  useEffect(() => {
    const timer = setInterval(next, 4000)
    // cleanup：元件卸載時清除定時器，避免 memory leak
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  // Framer Motion 動畫變體
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative h-[200px] overflow-hidden">
      {/* AnimatePresence：讓離場元素播放 exit 動畫 */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* 圖片或漸層背景（= Vue 的 v-if / v-else）*/}
          {slide.image
            ? (
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              )
            : (
                <div
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${slide.colorFrom || '#1e1b4b'}, ${slide.colorTo || '#312e81'})` }}
                />
              )}

          {/* 漸層遮罩 */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

          {/* 文字 */}
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white font-bold text-lg m-0 leading-tight drop-shadow"
               style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {slide.title}
            </p>
            {slide.subtitle && (
              <p className="text-white/70 text-xs m-0 mt-0.5">{slide.subtitle}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 左右箭頭 */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white/80 hover:bg-black/50 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* 導覽點 */}
      <div className="absolute bottom-2 right-3 flex gap-1 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{ background: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselBanner
```

**Step 3: 建立 src/components/home/CompanySlider.jsx**

```jsx
/**
 * CompanySlider — 娛樂公司水平選擇器
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：emit('select', company.id) → 父層 @select="onCompanySelect"
 * React：callback prop onSelect(id) → 父層傳入函數
 *
 * Vue：:class="activeId === company.id ? 'border-primary' : ''"
 * React：style={{ borderColor: isActive ? 'var(--color-primary)' : ... }}
 *        （className 也可以，但 CSS 變數更適合動態樣式）
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ companies: Array, activeId: string, onSelect: (id: string) => void }} props
 */

import { motion } from 'framer-motion'

function CompanySlider({ companies, activeId, onSelect }) {
  return (
    <div className="py-3">
      {/* overflow-x-auto + scrollbar-hide：水平滾動但隱藏捲軸 */}
      <div className="flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {/* .map()：React 的「v-for」— 永遠需要 key prop */}
        {companies.map((company) => {
          const isActive = activeId === company.id
          return (
            <motion.button
              key={company.id}
              onClick={() => onSelect(company.id)} // 直接傳函數（= Vue emit）
              className="flex flex-col items-center flex-shrink-0 min-w-[64px] cursor-pointer bg-transparent border-none p-0 outline-none"
              // Framer Motion whileHover/whileTap：簡潔的手勢動畫
              whileTap={{ scale: 0.92 }}
              animate={{ opacity: activeId && !isActive ? 0.4 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* 公司圖示方塊 */}
              <motion.div
                className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-colors duration-200"
                animate={{
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--border)',
                  scale: isActive ? 1.05 : 1,
                }}
                style={isActive ? { boxShadow: `0 0 16px ${company.color}55` } : {}}
              >
                {company.icon
                  ? (
                      <img src={company.icon} alt={company.name} className="w-full h-full object-contain" />
                    )
                  : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, ${company.gradientFrom}, ${company.gradientTo})`, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
                      >
                        {company.shortName.slice(0, 2)}
                      </div>
                    )}
              </motion.div>
              <span className="text-[11px] mt-1.5 text-center leading-tight font-medium" style={{ color: 'var(--text-secondary)' }}>
                {company.shortName}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default CompanySlider
```

**Step 4: 建立 src/components/home/MarqueeBanner.jsx**

```jsx
/**
 * MarqueeBanner — 公告跑馬燈
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：onMounted + setInterval，onUnmounted 清理
 * React：useEffect（同時處理 mount + unmount cleanup）
 *
 * Vue：const animationKey = ref(0)；:key="animationKey" 觸發重新動畫
 * React：const [animKey, setAnimKey] = useState(0)；key={animKey} 相同原理
 *   React 的 key 改變 = 強制卸載並重新掛載元件（重置動畫）
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ messages: string[] }} props
 */

import { useEffect, useState } from 'react'

// CSS 動畫 class（注入到 <head>，避免 styled-components 依賴）
const MARQUEE_STYLE = `
@keyframes marquee-slide {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
.marquee-animate {
  animation: marquee-slide 10s linear forwards;
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}
`

// 注入動畫樣式（只執行一次）
if (typeof document !== 'undefined' && !document.getElementById('marquee-style')) {
  const style = document.createElement('style')
  style.id = 'marquee-style'
  style.textContent = MARQUEE_STYLE
  document.head.appendChild(style)
}

function MarqueeBanner({ messages }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // animKey 改變 = 強制重新掛載 span（重置 CSS animation）
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // 函數式更新：確保使用最新 state（避免 stale closure 問題）
      // Vue：currentIndex.value = (currentIndex.value + 1) % messages.length
      setCurrentIndex(prev => (prev + 1) % messages.length)
      setAnimKey(prev => prev + 1)
    }, 10000)

    return () => clearInterval(interval) // cleanup = Vue 的 onUnmounted
  }, [messages.length])

  return (
    <div
      className="flex items-center py-2 overflow-hidden border-y"
      style={{ background: 'rgba(30,30,46,0.5)', borderColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* 喇叭 icon */}
      <svg className="ml-3 mr-2 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>

      <div className="flex-1 overflow-hidden mr-3">
        {/* key={animKey}：key 改變時 React 重新掛載此元素，重置動畫 */}
        <span
          key={animKey}
          className="marquee-animate text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {messages[currentIndex]}
        </span>
      </div>
    </div>
  )
}

export default MarqueeBanner
```

**Step 5: 建立 src/components/group/GroupCard.jsx**

```jsx
/**
 * GroupCard — 團體卡片
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：emit('click', group.id) → 父層 @click="goToGroup"
 * React：onClick prop → 父層傳 (id) => navigate(`/group/${id}`)
 *
 * Vue：:style="{ background: `${group.color}22` }"（模板字串）
 * React：style={{ background: `${group.color}22` }}（JSX 雙括號）
 *
 * Framer Motion whileHover/whileTap 替代 Vue 的 active:scale-95
 * ──────────────────────────────────────────────────────────────
 *
 * @param {{ group: object, onClick: (id: string) => void }} props
 */

import { motion } from 'framer-motion'

function GroupCard({ group, onClick }) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.4)',
      }}
      onClick={() => onClick(group.id)}
      // Framer Motion 手勢動畫（替代 CSS active:scale-95）
      whileHover={{ scale: 1.02, borderColor: `${group.color}44` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      {/* 封面圖區 */}
      <div className="relative h-[110px] overflow-hidden">
        {group.cover
          ? (
              <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
            )
          : (
              <div
                className="w-full h-full"
                style={{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }}
              />
            )}
        {/* 底部遮罩 */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />

        {/* 團體名稱 overlay */}
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white font-bold text-sm m-0 leading-tight truncate"
             style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
            {group.name}
          </p>
          <p className="text-white/60 text-[10px] m-0">{group.koreanName}</p>
        </div>
      </div>

      {/* 底部資訊列 */}
      <div className="px-3 py-2 flex items-center justify-between">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${group.color}22`, color: group.color }}
        >
          {group.fandomName}
        </span>
        {/* 箭頭 icon（SVG，無需 icon 庫）*/}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </motion.div>
  )
}

export default GroupCard
```

**Step 6: Commit**

```bash
git add apps/react-app/src/data/ apps/react-app/src/components/home/ apps/react-app/src/components/group/
git commit -m "feat(react-app): add CarouselBanner, CompanySlider, MarqueeBanner, GroupCard"
```

---

## Task 7：MemberCard + 三個頁面

**Files:**
- Create: `apps/react-app/src/components/member/MemberCard.jsx`
- Create: `apps/react-app/src/pages/HomePage.jsx`
- Create: `apps/react-app/src/pages/GroupPage.jsx`
- Create: `apps/react-app/src/pages/MemberPage.jsx`
- Create: `apps/react-app/src/pages/NotFoundPage.jsx`

**Step 1: 建立 src/components/member/MemberCard.jsx**

```jsx
/**
 * MemberCard — 成員頭像卡片
 *
 * @param {{ member: object, clickable?: boolean, onClick?: (id: string) => void }} props
 */

import { motion } from 'framer-motion'

function MemberCard({ member, clickable = false, onClick }) {
  const handleClick = () => {
    if (clickable && onClick) onClick(member.id)
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      onClick={handleClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
      whileTap={clickable ? { scale: 0.92 } : {}}
    >
      {/* 圓形頭像 */}
      <div
        className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
        style={{
          borderColor: member.color || 'var(--border)',
          boxShadow: member.color ? `0 0 12px ${member.color}44` : 'none',
        }}
      >
        {member.photo
          ? (
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
            )
          : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-lg select-none"
                style={{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}aa, ${member.color || '#374151'}44)` }}
              >
                {member.name.charAt(0)}
              </div>
            )}
      </div>

      {/* 姓名 */}
      <span className="text-xs text-center leading-tight font-medium mt-0.5 w-full truncate px-1"
            style={{ color: 'var(--text-base)' }}>
        {member.name}
      </span>
      <span className="text-[10px] text-center leading-tight"
            style={{ color: 'var(--text-muted)' }}>
        {member.koreanName}
      </span>
    </motion.div>
  )
}

export default MemberCard
```

**Step 2: 建立 src/pages/HomePage.jsx**

```jsx
/**
 * HomePage — 首頁
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：const router = useRouter()；router.push({ name: 'Group', params: { id } })
 * React：const navigate = useNavigate()；navigate(`/group/${id}`)
 *
 * Vue：const selectedCompanyId = ref(companies[0].id)
 * React：const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id)
 *
 * Vue：const displayedGroups = computed(() => getGroupsByCompany(selectedCompanyId.value))
 * React：const displayedGroups = useMemo(() => getGroupsByCompany(selectedCompanyId), [selectedCompanyId])
 *
 * 重要差異：
 *   Vue computed 是「懶惰求值 + 自動追蹤依賴」
 *   React useMemo 需要「手動宣告 dependencies」（ESLint exhaustive-deps 會提醒）
 * ──────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import CarouselBanner from '@/components/home/CarouselBanner'
import CompanySlider from '@/components/home/CompanySlider'
import GroupCard from '@/components/group/GroupCard'
import MarqueeBanner from '@/components/home/MarqueeBanner'
import { companies, getGroupsByCompany } from '@/data/kpop'

// 靜態資料（元件外定義，避免每次 re-render 重建）
// Vue 對應：<script setup> 頂層的 const（也只執行一次）
const carouselSlides = [
  { id: 1, image: '/images/home/carousel/26_twice.jpg', title: 'TWICE', subtitle: 'JYP Entertainment', colorFrom: '#ff6b9d', colorTo: '#ff8e53' },
  { id: 2, image: '/images/home/carousel/26_day6.jpg', title: 'Day6', subtitle: 'JYP Entertainment', colorFrom: '#f59e0b', colorTo: '#10b981' },
  { id: 3, image: '/images/home/carousel/26_jm2026.jpg', title: 'K-Pop Hub', subtitle: '探索你喜愛的 K-pop 團體', colorFrom: '#7c3aed', colorTo: '#2563eb' },
  { id: 4, image: '', title: 'BTS', subtitle: 'HYBE Labels', colorFrom: '#4f46e5', colorTo: '#7c3aed' },
  { id: 5, image: '', title: 'BLACKPINK', subtitle: 'YG Entertainment', colorFrom: '#ec4899', colorTo: '#374151' },
]

const marqueeMessages = [
  '歡迎來到 K-Pop Hub！探索你最愛的韓流偶像 ✨',
  'TWICE 出道 10 週年，粉絲見面會全球巡迴中 🎉',
  'NewJeans 新單曲登上 Billboard Global 排行榜 🏆',
  'aespa 世界巡迴演唱會亞洲場開票中，趕快搶票！',
  'Stray Kids 連續登頂 Billboard 200 冠軍 🔥',
  'BTS 全員退伍！2025 完整體回歸！ARMY 期待已久 💜',
]

// staggered animation variants（讓卡片依序出現）
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function HomePage() {
  // useState：本地 state，取代 Vue 的 ref()
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id)

  // useNavigate：取得導航函數，取代 Vue 的 useRouter()
  const navigate = useNavigate()

  // useMemo：緩存計算結果，取代 Vue 的 computed
  // [selectedCompanyId]：dependencies array，只有這個值變化時才重算
  const displayedGroups = useMemo(
    () => getGroupsByCompany(selectedCompanyId),
    [selectedCompanyId],
  )

  return (
    <div className="flex flex-col -mx-4 -mt-4">
      {/* 1. 輪播圖 */}
      <section>
        <CarouselBanner slides={carouselSlides} />
      </section>

      {/* 2. 公告跑馬燈 */}
      <section>
        <MarqueeBanner messages={marqueeMessages} />
      </section>

      {/* 3. 娛樂公司選擇器 */}
      <section>
        <div className="px-4 pt-4 pb-0">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest m-0"
              style={{ color: 'var(--text-muted)' }}>
            娛樂公司
          </h2>
        </div>
        <CompanySlider
          companies={companies}
          activeId={selectedCompanyId}
          onSelect={setSelectedCompanyId} // 直接傳 setState setter
        />
      </section>

      {/* 4. 旗下團體 Grid */}
      <section className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold m-0" style={{ color: 'var(--text-base)' }}>
            旗下團體
          </h2>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {displayedGroups.length}
          </span>
        </div>

        {/* 卡片 grid 帶 stagger 動畫 */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={selectedCompanyId} // key 改變 = 重新觸發動畫
        >
          {displayedGroups.map(group => (
            <motion.div key={group.id} variants={cardVariants}>
              <GroupCard
                group={group}
                onClick={(id) => navigate(`/group/${id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage
```

**Step 3: 建立 src/pages/GroupPage.jsx**

```jsx
/**
 * GroupPage — 團體詳情頁
 *
 * ── Vue 對比 ──────────────────────────────────────────────────
 * Vue：const route = useRoute()；route.params.id
 * React：const { id } = useParams()（直接解構）
 *
 * Vue：watchEffect(() => { if (!group.value) router.replace({ name: 'Home' }) })
 * React：useEffect(() => { if (!group) navigate('/', { replace: true }) }, [group, navigate])
 *
 * Vue：v-if="group"（條件渲染）
 * React：if (!group) return null（早期返回，更直觀）
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import MemberCard from '@/components/member/MemberCard'
import { getCompanyById, getGroupById, getMembersByGroup } from '@/data/kpop'

function GroupPage() {
  // useParams：讀取動態路由參數，= Vue 的 route.params
  const { id } = useParams()
  const navigate = useNavigate()

  const group = useMemo(() => getGroupById(id), [id])
  const company = useMemo(() => group ? getCompanyById(group.companyId) : null, [group])
  const members = useMemo(() => group ? getMembersByGroup(group.id) : [], [group])

  // useEffect 替代 Vue 的 watchEffect
  useEffect(() => {
    if (group === undefined) {
      navigate('/', { replace: true }) // replace: true = Vue 的 router.replace
    }
  }, [group, navigate])

  // 早期返回（= Vue 的 v-if="group"）
  if (!group) return null

  // 成員 grid 欄數（= Vue 的 :class 動態計算）
  const gridCols = members.length <= 4 ? 'grid-cols-4' : members.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <motion.div
      className="flex justify-center min-h-full -mx-4 -mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-[480px] pb-6">
        {/* Hero 封面圖 */}
        <div className="relative h-[220px] overflow-hidden">
          {group.cover
            ? <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
            : (
                <div className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }}
                />
              )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2) 50%, transparent)' }} />

          <div className="absolute bottom-4 left-4 right-4">
            {company && <p className="text-white/60 text-xs m-0 mb-0.5">{company.name}</p>}
            <h1 className="text-white text-2xl font-bold m-0 leading-tight"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {group.name}
            </h1>
            <p className="text-white/70 text-sm m-0 mt-0.5">{group.koreanName}</p>
          </div>
        </div>

        {/* Info Chips */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: `${group.color}22`, color: group.color }}>
            ♡ {group.fandomName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
            📅 出道 {group.debut}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
            👥 {members.length} 位成員
          </span>
        </div>

        {/* 簡介 */}
        <div className="px-4 pt-3 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
            {group.description}
          </p>
        </div>

        {/* 成員列表 */}
        <div className="px-4 pt-4">
          <h2 className="text-sm font-bold mb-4 m-0" style={{ color: 'var(--text-base)' }}>成員</h2>
          <div className={`grid gap-4 ${gridCols}`}>
            {members.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                clickable
                onClick={(memberId) => navigate(`/member/${memberId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GroupPage
```

**Step 4: 建立 src/pages/MemberPage.jsx**

```jsx
/**
 * MemberPage — 成員詳情頁
 */

import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { getGroupById, getMemberById } from '@/data/kpop'

function MemberPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const member = useMemo(() => getMemberById(id), [id])
  const group = useMemo(() => member ? getGroupById(member.groupId) : null, [member])

  useEffect(() => {
    if (member === undefined) navigate('/', { replace: true })
  }, [member, navigate])

  if (!member) return null

  return (
    <motion.div
      className="flex justify-center min-h-full -mx-4 -mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-[480px] pb-8">
        {/* 照片 Hero */}
        <div className="relative h-[300px] overflow-hidden">
          {member.photo
            ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
            : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}66, ${member.color || '#374151'}22 70%), linear-gradient(180deg, transparent 40%, black)` }}
                >
                  <span className="text-white/20 font-bold select-none" style={{ fontSize: '8rem', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2) 60%, transparent)' }} />

          {/* 返回團體連結 */}
          <button
            className="absolute top-4 left-4 flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
            onClick={() => group && navigate(`/group/${group.id}`)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{group?.name}</span>
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white text-2xl font-bold m-0 leading-tight"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              {member.name}
            </h1>
            <p className="text-white/70 text-sm m-0 mt-0.5">
              {member.koreanName} · {member.englishName}
            </p>
          </div>
        </div>

        {/* 基本資料卡片 */}
        <div className="mx-4 mt-4 rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>生日</p>
              <p className="text-sm font-medium m-0" style={{ color: 'var(--text-base)' }}>{member.birthday}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>國籍</p>
              <p className="text-sm font-medium m-0" style={{ color: 'var(--text-base)' }}>{member.nationality}</p>
            </div>
            {group && (
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wider m-0 mb-0.5" style={{ color: 'var(--text-muted)' }}>所屬團體</p>
                <button
                  className="text-sm font-medium bg-transparent border-none cursor-pointer p-0 flex items-center gap-1"
                  style={{ color: group.color }}
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  {group.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 擔當 */}
        <div className="px-4 mt-4">
          <h2 className="text-sm font-bold mb-3 m-0" style={{ color: 'var(--text-base)' }}>擔當</h2>
          <div className="flex flex-wrap gap-2">
            {member.position?.map(pos => (
              <span
                key={pos}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: `${member.color || '#374151'}22`, color: member.color || 'var(--text-muted)' }}
              >
                {pos}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MemberPage
```

**Step 5: 建立 src/pages/NotFoundPage.jsx**

```jsx
import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl font-bold m-0 mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
        404
      </p>
      <h1 className="text-lg font-bold m-0 mb-1" style={{ color: 'var(--text-base)' }}>找不到頁面</h1>
      <p className="text-sm m-0 mb-6" style={{ color: 'var(--text-muted)' }}>這個頁面不存在或已被移除</p>
      <Link
        to="/"
        className="text-sm font-medium px-5 py-2 rounded-full no-underline transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-primary)', color: 'white' }}
      >
        回首頁
      </Link>
    </div>
  )
}

export default NotFoundPage
```

**Step 6: Commit**

```bash
git add apps/react-app/src/components/member/ apps/react-app/src/pages/
git commit -m "feat(react-app): add all pages and MemberCard component"
```

---

## Task 8：Dockerfile + nginx.conf + .dockerignore

**Files:**
- Create: `apps/react-app/Dockerfile`
- Create: `apps/react-app/nginx.conf`
- Create: `apps/react-app/.dockerignore`

**Step 1: 建立 apps/react-app/nginx.conf**

```nginx
# nginx SPA 路由設定
# 重點：try_files 確保所有路徑都回傳 index.html
# 這樣 React Router 才能在客戶端處理路由（/group/twice 不會被 nginx 當作檔案找）
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # 啟用 gzip 壓縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 靜態資源快取（Vite build 產生的 hash 檔名，可長期快取）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing：找不到檔案時回傳 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Step 2: 建立 apps/react-app/Dockerfile**

```dockerfile
# ════════════════════════════════════════════════════════
# K-Pop Hub — react-app Dockerfile
# Multi-stage build for Monorepo (pnpm workspace)
# Build context: monorepo root (Zeabur 預設從根目錄 build)
# ════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────
# Stage 1: Builder
# 負責安裝依賴 + 執行 Vite build
# 使用 node:22-slim（比 full 版小很多，去除非必要工具）
# ──────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# 安裝 pnpm（版本與 packageManager 欄位對齊）
# --force 避免 corepack 版本衝突問題
RUN npm install -g pnpm@9 --force

# ── 複製 workspace 設定檔（先複製這些，利用 Docker layer cache）
# 只要這些檔案不變，後續 pnpm install 就能直接用快取
# 這是 monorepo Dockerfile 的關鍵優化技巧
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# ── 複製所有 apps/packages 的 package.json（供 pnpm 解析 workspace 依賴）
# pnpm 需要知道整個 workspace 的結構才能正確安裝
COPY apps/react-app/package.json ./apps/react-app/
# 如果 react-app 有用到 shared packages，也要複製它們的 package.json：
# COPY packages/shared-design-tokens/package.json ./packages/shared-design-tokens/

# ── 安裝依賴（只安裝 react-app 需要的部分）
# --filter=@interview/react-app... 中的 ... 表示「含所有 workspace 依賴」
# 這樣比 pnpm install（全裝）快很多
RUN pnpm install --filter=@interview/react-app... --frozen-lockfile

# ── 複製源碼（在安裝依賴之後，利用快取）
# 如果只改了 src/ 的程式碼，可以跳過重新安裝依賴
COPY apps/react-app/ ./apps/react-app/
# 複製 shared packages 源碼（如果有依賴的話）：
# COPY packages/shared-design-tokens/ ./packages/shared-design-tokens/

# ── 執行 Vite build
# 產生靜態檔案到 apps/react-app/dist/
RUN pnpm --filter=@interview/react-app build

# ──────────────────────────────────────────────────────
# Stage 2: Production
# 只保留 nginx + 靜態檔案，丟掉所有 node_modules 和源碼
# nginx:alpine 只有約 40MB（比 node:22-slim 的 200MB+ 小很多）
# ──────────────────────────────────────────────────────
FROM nginx:alpine AS production

# 複製 builder stage 產生的靜態檔案到 nginx 服務目錄
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html

# 複製 nginx 設定（SPA routing 支援）
COPY apps/react-app/nginx.conf /etc/nginx/conf.d/default.conf

# nginx 預設監聽 80 port（Zeabur 會自動對應到外部 port）
EXPOSE 80

# nginx:alpine 預設 CMD 已啟動 nginx，不需要額外設定
```

**Step 3: 建立 apps/react-app/.dockerignore**

```
# .dockerignore — 排除不需要複製進 Docker build context 的檔案
# 減少 build context 大小，加速 docker build

# 依賴目錄（不需要，Docker 內會重新安裝）
node_modules/
**/node_modules/

# build 產物（不需要，Docker 內會重新 build）
dist/
**/dist/

# 開發工具設定（不需要帶入 production build）
.git/
.gitignore
.eslintcache
*.log

# 環境變數（絕對不能帶入 image，應該透過 Zeabur 環境變數注入）
.env
.env.local
.env.*.local

# IDE 設定
.vscode/
.idea/

# macOS
.DS_Store
```

**Step 4: Commit**

```bash
git add apps/react-app/Dockerfile apps/react-app/nginx.conf apps/react-app/.dockerignore
git commit -m "feat(react-app): add multi-stage Dockerfile + nginx SPA config"
```

---

## Task 9：驗證與收尾

**Step 1: 驗證 pnpm install 成功**

```bash
cd /path/to/monorepo/root
pnpm install
```

Expected: 無錯誤

**Step 2: 驗證 dev server 啟動**

```bash
pnpm dev:react
```

Expected: `http://localhost:5173` 可以開啟，看到 K-Pop Hub 首頁

**Step 3: 驗證 build 成功**

```bash
pnpm --filter=@interview/react-app build
```

Expected: `apps/react-app/dist/` 目錄出現，無 TypeScript/ESLint 錯誤

**Step 4: 驗證 lint 通過**

```bash
pnpm --filter=@interview/react-app lint
```

Expected: 無 error（可能有 warn，允許）

**Step 5: 最終 commit**

```bash
git add .
git commit -m "feat: add react-app — K-Pop Hub React 19 + RTK + Tailwind v4 + Midnight Seoul"
```

---

## 快速參考：Vue → React 對照表

| 概念 | Vue 3 | React 19 |
|------|-------|---------|
| 本地狀態 | `ref()` / `reactive()` | `useState()` |
| 計算屬性 | `computed()` | `useMemo()` |
| 副作用 | `onMounted` + `onUnmounted` | `useEffect(() => { ... ; return cleanup }, deps)` |
| 監聽 | `watch()` / `watchEffect()` | `useEffect(() => { ... }, [dep])` |
| 全域狀態 | Pinia `defineStore` | RTK `createSlice` + `useSelector` / `useDispatch` |
| 路由 | `useRouter()` / `useRoute()` | `useNavigate()` / `useParams()` / `useLocation()` |
| Props | `defineProps({ name: Type })` | `function Comp({ name })` |
| Emit | `defineEmits(['click'])` + `emit('click', val)` | `onClick` prop（直接傳函數） |
| 條件渲染 | `v-if="condition"` | `{condition && <div />}` 或 early return |
| 列表渲染 | `v-for="item in list" :key="item.id"` | `{list.map(item => <div key={item.id} />)}` |
| 雙向綁定 | `v-model="value"` | `value={val} onChange={e => setVal(e.target.value)}` |
| 插槽 | `<slot />` | `{children}` prop |
| 路由插槽 | `<RouterView />` | `<Outlet />` |
| 動畫 | CSS transition / `<Transition>` | Framer Motion `<motion.div>` |

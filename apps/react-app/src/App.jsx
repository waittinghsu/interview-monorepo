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

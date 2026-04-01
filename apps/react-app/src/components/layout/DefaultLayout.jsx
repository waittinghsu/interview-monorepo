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

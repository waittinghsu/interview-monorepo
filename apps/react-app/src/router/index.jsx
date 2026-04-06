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

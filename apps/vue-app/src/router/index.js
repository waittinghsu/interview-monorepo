import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 登入頁面（不使用 DefaultLayout）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/pages/AboutPage.vue'),
      },
      {
        path: 'seat-grid',
        name: 'SeatGrid',
        component: () => import('@/pages/SeatGridPage.vue'),
      },
      {
        path: 'seat-rotate',
        name: 'SeatRotate',
        component: () => import('@/pages/SeatRotatePage.vue'),
      },
      {
        path: 'tic-tac-toe',
        name: 'TicTacToe',
        component: () => import('@/pages/TicTacToePage.vue'),
      },
      {
        path: 'chart',
        name: 'Chart',
        component: () => import('@/pages/ChartPage.vue'),
      },
      {
        path: 'number-guess',
        name: 'NumberGuess',
        component: () => import('@/pages/NumberGuessPage.vue'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
      {
        path: 'portfolio',
        name: 'Portfolio',
        component: () => import('@/pages/PortfolioPage.vue'),
      },
      {
        path: 'api-test',
        name: 'ApiTest',
        component: () => import('@/pages/ApiTestPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守衛範例
router.beforeEach((to, from, next) => {
  // 可在此處理權限驗證
  next()
})

export default router

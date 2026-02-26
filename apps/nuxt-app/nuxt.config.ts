import { execSync } from 'node:child_process'

// 獲取 git commit hash
function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  }
  catch {
    return 'unknown'
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Nitro 設定（用於生產環境）
  nitro: {
    preset: 'node-server', // 強制使用 node-server（Zeabur 自動偵測 zeabur preset 有問題）
    // 確保使用環境變數的端口
    experimental: {
      openAPI: false,
    },
  },

  // 開發伺服器設定
  devServer: {
    port: 30678,
  },

  // Vite 設定
  vite: {
    server: {
      open: true, // 不自動開啟瀏覽器
    },
  },

  // SSR 設定
  ssr: true, // ✅ 全局開啟 SSR

  // 路由規則：為不需要 SSR 的頁面關閉
  routeRules: {
    // 動畫/互動頁面關閉 SSR
    '/loading': { ssr: false },
    '/chart': { ssr: false },
    '/tic-tac-toe': { ssr: false },
    '/number-guess': { ssr: false },
    '/photo': { ssr: false },
    '/mail': { ssr: false },
    '/book': { ssr: false },
    '/about': { ssr: false },
    '/': { ssr: false }, // 首頁（如果有動畫）
    '/seat-grid': { ssr: false }, // 座位距離（互動遊戲）
    '/seat-rotate': { ssr: false }, // 陣列旋轉（互動遊戲）
    '/dashboard': { ssr: false }, // AI Social Dashboard（即時更新）

    // 以下頁面保持 SSR（可以不寫，因為全局已開啟）
    // '/about': { ssr: true },
    // '/ssr-demo': { ssr: true },
    // '/ssr-test': { ssr: true },
    // '/user-info': { ssr: true },
  },

  // TypeScript 設定
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // 模組
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    'nuxt-quasar-ui',
  ],

  // Quasar 設定
  quasar: {
    plugins: ['Notify', 'Loading', 'Dark'],
    extras: {
      fontIcons: ['material-icons'],
    },
  },

  // UnoCSS 設定 (使用 uno.config.ts)

  // Runtime Config
  runtimeConfig: {
    // 伺服器端
    apiSecret: '',
    // 客戶端 (public)
    public: {
      apiBaseUrl: '/api',
    },
  },

  // 組件自動導入設定
  components: [
    {
      path: '~/components/common',
      pathPrefix: false, // 不使用目錄名作為前綴
    },
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // 應用程式設定
  app: {
    head: {
      title: 'Interview Nuxt',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'git-commit-hash', content: getGitCommitHash() },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' },
      ],
    },
  },
})

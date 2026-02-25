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
    plugins: [
      // 自定義插件：注入 git commit hash 到 HTML meta
      {
        name: 'html-transform',
        transformIndexHtml() {
          return [
            {
              tag: 'meta',
              attrs: {
                name: 'git-commit-hash',
                content: getGitCommitHash(),
              },
              injectTo: 'head',
            },
          ]
        },
      },
    ],
  },

  // SSR 設定
  ssr: true,

  // 路由規則：禁用特定路由的 SSR
  routeRules: {
    '/loading': { ssr: false }, // Loading 頁面完全不進行 SSR
    '/': { ssr: false }, // Loading 頁面完全不進行 SSR
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
      ],
    },
  },
})

export default defineNuxtConfig({
  compatibilityDate: '2026-03-01',
  devtools: { enabled: true },

  devServer: {
    port: 3002,
  },

  // Nitro 設定（用於生產環境）
  nitro: {
    preset: 'node-server', // 強制使用 node-server（Zeabur 自動偵測 zeabur preset 有問題）
    // 確保使用環境變數的端口
    experimental: {
      openAPI: false,
    },
  },

  runtimeConfig: {
    public: {
      githubToken: '', // 從 NUXT_PUBLIC_GITHUB_TOKEN 自動讀取
    },
  },

  ssr: false,

  typescript: {
    strict: true,
    typeCheck: false,
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  app: {
    head: {
      title: 'SmartAuto — GitHub Repos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})

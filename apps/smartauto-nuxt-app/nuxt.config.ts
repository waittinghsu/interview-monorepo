export default defineNuxtConfig({
  compatibilityDate: '2026-03-01',
  devtools: { enabled: true },

  devServer: {
    port: 3002,
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

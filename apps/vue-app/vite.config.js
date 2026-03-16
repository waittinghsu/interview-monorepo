import { execSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// 獲取 git commit hash
function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  }
  catch {
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: false,
    }),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      dirs: [
        './src/composables',
        './src/stores',
      ],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/components', 'src/layouts'],
      dts: 'src/components.d.ts',
    }),
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9528,
    open: true, // 不自動開啟瀏覽器
  },
  build: {
    // 生產環境保留 console（使用 esbuild）
    minify: 'esbuild',
    // esbuild 預設不會移除 console，無需額外配置
  },
  esbuild: {
    // 確保生產環境保留 console 和 debugger
    drop: [], // 不移除任何語句
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})

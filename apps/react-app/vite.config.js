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
  preview: {
    port: 5173,
  },
  build: {
    // 明確指定 build target，確保瀏覽器相容性可控
    target: 'es2022',
    // hidden sourcemap：生產環境方便排錯，但不暴露給使用者
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        // vendor chunk 分割：讓 React/Redux 等大型依賴獨立快取
        // 使用者改了業務程式碼，vendor bundle 不需重新下載
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// 使用 SSR 資料
const { data: serverTime } = await useAsyncData('serverTime', () => {
  return Promise.resolve(new Date().toISOString())
})

// Action Buttons
const actionButtons = [
  { id: 1, label: '圖表', icon: 'i-mdi-chart-line', route: '/chart' },
  { id: 2, label: '圈圈叉叉', icon: 'i-mdi-gamepad-variant', route: '/tic-tac-toe' },
  { id: 3, label: '會員資料', icon: 'i-mdi-account-circle', route: '/user-info' },
  { id: 4, label: '關於', icon: 'i-mdi-information', route: '/about' },
]

// Grid Items
const gridItems = [
  { id: 1, color: 'bg-gradient-to-br from-blue-400 to-blue-600', label: '股票圖表', route: '/chart' },
  { id: 2, color: 'bg-gradient-to-br from-purple-400 to-purple-600', label: '圈圈叉叉', route: '/tic-tac-toe' },
  { id: 3, color: 'bg-gradient-to-br from-orange-400 to-orange-600', label: '會員資料', route: '/user-info' },
  { id: 4, color: 'bg-gradient-to-br from-green-400 to-green-600', label: '關於我們', route: '/about' },
]
</script>

<template>
  <div class="p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2 text-textPrimary">
        Interview Nuxt
      </h1>
      <p class="text-textSecondary mb-6">
        Nuxt 3 + Quasar + TanStack Query + UnoCSS
      </p>

      <!-- SSR 資料展示 -->
      <div class="bg-sys-surface rounded-lg p-4 mb-6 border border-sys-border">
        <h2 class="text-lg font-semibold mb-2 text-textPrimary">
          SSR 資料
        </h2>
        <p class="text-textSecondary text-sm">
          伺服器渲染時間：{{ serverTime }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-textPrimary">
          快速連結
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="btn in actionButtons"
            :key="btn.id"
            :to="btn.route"
            class="bg-sys-surface rounded-lg p-4 flex flex-col items-center gap-2 hover:bg-sys-surface-light transition-colors border border-sys-border"
          >
            <div class="text-3xl text-primary" :class="[btn.icon]" />
            <span class="text-textSecondary text-sm">{{ btn.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Grid Items -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-textPrimary">
          功能列表
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="item in gridItems"
            :key="item.id"
            :to="item.route"
            class="rounded-lg p-6 flex-center hover:scale-105 transition-transform" :class="[item.color]"
          >
            <span class="text-white font-bold">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 技術說明 -->
      <div class="bg-sys-surface rounded-lg p-4 border border-sys-border">
        <h2 class="text-lg font-semibold mb-3 text-textPrimary">
          技術特點
        </h2>
        <ul class="text-textSecondary text-sm space-y-2">
          <li>SSR + CSR 混合渲染</li>
          <li>使用 Nuxt 原生 $fetch API</li>
          <li>Mock API 端點示範</li>
          <li>共享 Design Token (@interview/shared-design-tokens)</li>
          <li>動態主題切換</li>
        </ul>
      </div>
    </div>
  </div>
</template>

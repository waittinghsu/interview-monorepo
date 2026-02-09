<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="p-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-textPrimary">
        關於此專案
      </h1>

      <div class="bg-sys-surface rounded-lg p-6 mb-6 border border-sys-border">
        <h2 class="text-xl font-semibold mb-4 text-textPrimary">
          Interview Nuxt
        </h2>
        <p class="text-textSecondary mb-4">
          這是一個使用 Monorepo 架構建立的面試練習專案，包含 Vue 3 SPA 和 Nuxt 3 SSR 兩個應用程式。
        </p>

        <h3 class="text-lg font-semibold mb-2 text-textPrimary">
          技術棧
        </h3>
        <ul class="text-textSecondary space-y-1 mb-4">
          <li>Nuxt 3 - SSR 框架</li>
          <li>TypeScript - 型別安全</li>
          <li>Quasar - UI 元件庫</li>
          <li>TanStack Query - 伺服器狀態管理</li>
          <li>UnoCSS - 原子化 CSS</li>
          <li>Pinia - 狀態管理</li>
          <li>Zod - Schema 驗證</li>
        </ul>

        <h3 class="text-lg font-semibold mb-2 text-textPrimary">
          共享 Packages
        </h3>
        <ul class="text-textSecondary space-y-1">
          <li>@interview/shared-api - HTTP Client + Services + Schemas</li>
          <li>@interview/shared-design-tokens - 主題配置</li>
          <li>@interview/shared-mocks - MSW Handlers</li>
          <li>@interview/shared-utils - 工具函數</li>
        </ul>
      </div>

      <div class="bg-sys-surface rounded-lg p-6 border border-sys-border">
        <h2 class="text-xl font-semibold mb-4 text-textPrimary">
          API 四層架構
        </h2>
        <div class="text-textSecondary space-y-2">
          <p><strong class="text-textPrimary">1. httpClient 層</strong> - Axios + 攔截器 + Zod 驗證</p>
          <p><strong class="text-textPrimary">2. API Service 層</strong> - 純 endpoint 定義</p>
          <p><strong class="text-textPrimary">3. Composable 層</strong> - TanStack Query hooks</p>
          <p><strong class="text-textPrimary">4. Page 層</strong> - useAsyncData (SSR) + useQuery (CSR)</p>
        </div>
      </div>

      <NuxtLink to="/" class="inline-block mt-6 text-textSecondary hover:text-primary">
        ← 返回首頁
      </NuxtLink>
    </div>
  </div>
</template>

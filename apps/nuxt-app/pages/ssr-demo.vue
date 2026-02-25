<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'SSR Demo',
})

// ✅ 從 API 獲取數據（SSR 會在服務器端執行）
const { data: posts, pending } = await useFetch('/api/posts')

const currentTime = new Date().toISOString()
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-textBase mb-6">
        SSR 實驗頁面
      </h1>

      <!-- 說明區塊 -->
      <div class="bg-sys-card rounded-lg p-6 mb-6 border border-sys-border">
        <h2 class="text-xl font-bold text-textBrand mb-4">
          如何驗證 SSR？
        </h2>
        <ol class="list-decimal list-inside space-y-2 text-textSecondary">
          <li>右鍵 → 檢視網頁原始碼</li>
          <li>搜尋「SSR 實驗文章」</li>
          <li>如果找得到 → ✅ SSR 成功</li>
          <li>如果找不到 → ❌ 只有客戶端渲染</li>
        </ol>
      </div>

      <!-- 服務器時間（會造成 hydration mismatch，僅作示範） -->
      <div class="bg-sys-raised rounded-lg p-4 mb-6">
        <p class="text-textSecondary text-sm">
          服務器渲染時間：<span class="text-textBrand font-mono">{{ currentTime }}</span>
        </p>
        <p class="text-textMuted text-xs mt-2">
          ⚠️ 這個時間會造成 hydration mismatch（正常現象，僅作示範）
        </p>
      </div>

      <!-- 文章列表 -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-textBase mb-4">
          文章列表（SSR 預取）
        </h2>

        <div v-if="pending" class="text-textSecondary">
          載入中...
        </div>

        <div
          v-for="post in posts"
          v-else
          :key="post.id"
          class="bg-sys-card rounded-lg p-6 border border-sys-border hover:border-textBrand transition-all"
        >
          <h3 class="text-xl font-bold text-textBase mb-2">
            {{ post.title }}
          </h3>
          <p class="text-textSecondary">
            {{ post.content }}
          </p>
        </div>
      </div>

      <!-- 對比說明 -->
      <div class="mt-8 bg-sys-card rounded-lg p-6 border border-sys-border">
        <h2 class="text-xl font-bold text-textBrand mb-4">
          SSR vs CSR 對比
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-bold text-textBase mb-2">
              ✅ 此頁面（SSR）
            </h3>
            <ul class="text-textSecondary text-sm space-y-1">
              <li>• 查看源碼能看到內容</li>
              <li>• 搜索引擎可索引</li>
              <li>• 禁用 JS 仍可看到內容</li>
              <li>• 首屏速度快</li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-textBase mb-2">
              ❌ 其他頁面（CSR）
            </h3>
            <ul class="text-textSecondary text-sm space-y-1">
              <li>• 查看源碼只有空白</li>
              <li>• 搜索引擎看不到內容</li>
              <li>• 禁用 JS 完全空白</li>
              <li>• 需要等待 JS 載入</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 返回首頁 -->
      <div class="mt-6 text-center">
        <NuxtLink
          to="/"
          class="text-textBrand hover:text-primary transition-colors"
        >
          返回首頁
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

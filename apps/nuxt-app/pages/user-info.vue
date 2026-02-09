<script setup lang="ts">
import { useRefetchUserInfo, useUpdateUserInfoMutation, useUserInfoQuery, useUserService } from '~/features/user'

/**
 * SSR: 使用 useAsyncData 預先取得資料
 * 這部分只在服務端執行一次
 */
const { data: ssrData } = await useAsyncData('userInfo', async () => {
  const service = useUserService()
  return await service.getUserInfo()
})

/**
 * CSR: 使用 TanStack Query 管理客戶端狀態
 * 這部分在客戶端持續管理快取和更新
 */
const { data: userInfo, isPending, error, refetch } = useUserInfoQuery()

/**
 * Mutation: 更新會員資料
 */
const updateMutation = useUpdateUserInfoMutation()

/**
 * 手動重新取得
 */
const refetchUserInfo = useRefetchUserInfo()

/**
 * 計算屬性
 */
const displayUser = computed(() => userInfo.value || ssrData.value)

const avatarUrl = computed(() => {
  if (!displayUser.value?.avatarId)
    return ''
  return `/avatars/avatar-${displayUser.value.avatarId}.png`
})

const levelColor = computed(() => {
  const level = displayUser.value?.level || 0
  if (level >= 10)
    return 'text-purple-600'
  if (level >= 7)
    return 'text-blue-600'
  if (level >= 4)
    return 'text-green-600'
  return 'text-gray-600'
})

/**
 * 更新會員暱稱範例
 */
function handleUpdateNickname() {
  // eslint-disable-next-line no-alert
  const newNickname = prompt('輸入新暱稱')
  if (newNickname) {
    updateMutation.mutate({ nickname: newNickname })
  }
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- 架構說明 -->
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 class="text-lg font-bold mb-2 text-blue-900">
        🏗️ 新架構特點
      </h2>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>✅ <strong>useApiClient</strong>: 統一攔截器 + Abort 管理</li>
        <li>✅ <strong>Service 層</strong>: 封裝 API 調用</li>
        <li>✅ <strong>Zod Schema</strong>: 型別驗證</li>
        <li>✅ <strong>TanStack Query</strong>: 客戶端狀態管理</li>
        <li>✅ <strong>useAsyncData</strong>: SSR 預取資料</li>
        <li>✅ <strong>模組化結構</strong>: modules/user/{schemas,services,queries}</li>
      </ul>
    </div>

    <h1 class="text-3xl font-bold mb-8">
      會員資料頁面（重構版）
    </h1>

    <!-- Loading 狀態 -->
    <div v-if="isPending && !displayUser" class="text-center py-8">
      <div class="text-lg">
        載入中...
      </div>
    </div>

    <!-- Error 狀態 -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>錯誤：</strong> {{ error.message }}
    </div>

    <!-- 會員資料顯示 -->
    <div v-else-if="displayUser" class="space-y-6">
      <!-- 會員卡片 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center gap-6 mb-6">
          <!-- 頭像 -->
          <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {{ displayUser.avatarId }}
          </div>

          <!-- 基本資訊 -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">
              {{ displayUser.name }}
            </h2>
            <p class="text-gray-600 mb-1">
              @{{ displayUser.nickname }}
            </p>
            <p class="font-semibold" :class="[levelColor]">
              等級 {{ displayUser.level }} / 12
            </p>
          </div>

          <!-- 儲值金額 -->
          <div class="text-right">
            <p class="text-sm text-gray-500">
              帳戶餘額
            </p>
            <p class="text-3xl font-bold text-green-600">
              ${{ displayUser.balance }}
            </p>
          </div>
        </div>

        <!-- 詳細資訊 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
          <div>
            <p class="text-sm text-gray-500">
              會員編號
            </p>
            <p class="font-semibold">
              #{{ displayUser.memberId }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              手機號碼
            </p>
            <p class="font-semibold">
              {{ displayUser.phone }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              電子信箱
            </p>
            <p class="font-semibold">
              {{ displayUser.email }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              頭像編號
            </p>
            <p class="font-semibold">
              {{ displayUser.avatarId }}
            </p>
          </div>
        </div>

        <!-- 書籤收藏 -->
        <div class="pt-6 border-t mt-6">
          <p class="text-sm text-gray-500 mb-3">
            書籤收藏 ({{ displayUser.bookmarks.length }})
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="bookmark in displayUser.bookmarks"
              :key="bookmark"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              #{{ bookmark }}
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-4 flex-wrap">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="isPending"
          @click="refetch()"
        >
          {{ isPending ? '載入中...' : '重新整理 (refetch)' }}
        </button>

        <button
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          @click="refetchUserInfo()"
        >
          使快取失效 (invalidate)
        </button>

        <button
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          :disabled="updateMutation.isPending.value"
          @click="handleUpdateNickname"
        >
          {{ updateMutation.isPending.value ? '更新中...' : '更新暱稱 (mutation)' }}
        </button>
      </div>

      <!-- Mutation 狀態 -->
      <div v-if="updateMutation.isError.value" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>更新失敗：</strong> {{ updateMutation.error.value?.message }}
      </div>

      <div v-if="updateMutation.isSuccess.value" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <strong>更新成功！</strong>
      </div>
    </div>

    <!-- Debug 資訊 -->
    <details class="mt-8 border rounded-lg p-4">
      <summary class="cursor-pointer font-semibold">
        🔍 Debug 資訊
      </summary>
      <div class="mt-4 space-y-4">
        <div>
          <h4 class="font-semibold mb-2">
            SSR 資料:
          </h4>
          <pre class="text-xs overflow-auto bg-gray-100 p-2 rounded">{{ ssrData }}</pre>
        </div>
        <div>
          <h4 class="font-semibold mb-2">
            Query 狀態:
          </h4>
          <pre class="text-xs overflow-auto bg-gray-100 p-2 rounded">{{ { data: userInfo, isPending, error: error?.message } }}</pre>
        </div>
      </div>
    </details>
  </div>
</template>

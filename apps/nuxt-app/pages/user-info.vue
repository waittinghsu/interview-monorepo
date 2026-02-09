<script setup lang="ts">
import type { UserInfo } from '~/types/api'
import { useFetchUserInfo, useUserInfo } from '~/composables/api/useUserInfo'

// 三種不同的使用方式

// 方式 1: 使用 useFetch (推薦 - SSR 友好)
const { data: userInfoData, pending, error, refresh } = useFetchUserInfo()

// 方式 2: 使用 useAsyncData (更靈活)
// const { data: userInfoData, pending, error, refresh } = useAsyncUserInfo()

// 方式 3: 使用手動 fetch (客戶端)
const { getUserInfo } = useUserInfo()
const manualUserInfo = ref<UserInfo | null>(null)
const isLoading = ref(false)

async function fetchManually() {
  isLoading.value = true
  try {
    manualUserInfo.value = await getUserInfo()
  }
  catch (err) {
    console.error('手動取得失敗:', err)
  }
  finally {
    isLoading.value = false
  }
}

// 計算屬性：取得會員資料
const userInfo = computed(() => userInfoData.value?.data)

// 頭像 URL 計算
// eslint-disable-next-line unused-imports/no-unused-vars
const avatarUrl = computed(() => {
  if (!userInfo.value?.avatarId)
    return ''
  return `/avatars/avatar-${userInfo.value.avatarId}.png`
})

// 等級顏色
const levelColor = computed(() => {
  const level = userInfo.value?.level || 0
  if (level >= 10)
    return 'text-purple-600'
  if (level >= 7)
    return 'text-blue-600'
  if (level >= 4)
    return 'text-green-600'
  return 'text-gray-600'
})
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">
      會員資料頁面
    </h1>

    <!-- Loading 狀態 -->
    <div v-if="pending" class="text-center py-8">
      <div class="text-lg">
        載入中...
      </div>
    </div>

    <!-- Error 狀態 -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>錯誤：</strong> {{ error.message }}
    </div>

    <!-- 會員資料顯示 -->
    <div v-else-if="userInfo" class="space-y-6">
      <!-- 會員卡片 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center gap-6 mb-6">
          <!-- 頭像 -->
          <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {{ userInfo.avatarId }}
          </div>

          <!-- 基本資訊 -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">
              {{ userInfo.name }}
            </h2>
            <p class="text-gray-600 mb-1">
              @{{ userInfo.nickname }}
            </p>
            <p class="font-semibold" :class="[levelColor]">
              等級 {{ userInfo.level }} / 12
            </p>
          </div>

          <!-- 儲值金額 -->
          <div class="text-right">
            <p class="text-sm text-gray-500">
              帳戶餘額
            </p>
            <p class="text-3xl font-bold text-green-600">
              ${{ userInfo.balance }}
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
              #{{ userInfo.memberId }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              手機號碼
            </p>
            <p class="font-semibold">
              {{ userInfo.phone }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              電子信箱
            </p>
            <p class="font-semibold">
              {{ userInfo.email }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              頭像編號
            </p>
            <p class="font-semibold">
              {{ userInfo.avatarId }}
            </p>
          </div>
        </div>

        <!-- 書籤收藏 -->
        <div class="pt-6 border-t mt-6">
          <p class="text-sm text-gray-500 mb-3">
            書籤收藏 ({{ userInfo.bookmarks.length }})
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="bookmark in userInfo.bookmarks"
              :key="bookmark"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              #{{ bookmark }}
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-4">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          @click="refresh()"
        >
          重新整理資料
        </button>

        <button
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          :disabled="isLoading"
          @click="fetchManually"
        >
          {{ isLoading ? '載入中...' : '手動取得 (客戶端)' }}
        </button>
      </div>

      <!-- 手動取得的資料 -->
      <div v-if="manualUserInfo" class="bg-gray-100 p-4 rounded-lg">
        <h3 class="font-bold mb-2">
          手動取得的資料：
        </h3>
        <pre class="text-xs overflow-auto">{{ manualUserInfo }}</pre>
      </div>
    </div>

    <!-- Debug 資訊 -->
    <details class="mt-8 border rounded-lg p-4">
      <summary class="cursor-pointer font-semibold">
        Debug 資訊
      </summary>
      <pre class="mt-4 text-xs overflow-auto">{{ { userInfoData, pending, error } }}</pre>
    </details>
  </div>
</template>

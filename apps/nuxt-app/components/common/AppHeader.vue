<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'
import { useUserStore } from '~/stores/user'

const emit = defineEmits<{
  toggleDrawer: []
}>()

const themeStore = useThemeStore()
const userStore = useUserStore()
const router = useRouter()

// 登出處理
async function handleLogout() {
  await userStore.logout()
  router.push('/')
}

// 跳轉到登入頁
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <q-header class="bg-sys-card border-b border-sys-border">
    <q-toolbar>
      <!-- 漢堡選單 -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        @click="emit('toggleDrawer')"
      />

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 no-underline">
        <div class="i-mdi-lightning-bolt text-2xl text-textBrand" />
        <span class="text-xl font-bold text-textBase gt-xs">Cyberpunk Studio</span>
      </NuxtLink>

      <q-space />

      <!-- 主題切換器 -->
      <q-select
        v-model="themeStore.currentThemeName"
        :options="themeStore.themeOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        dense
        outlined
        class="w-28 sm:w-40"
        @update:model-value="themeStore.setTheme"
      />
      <!-- 登入/登出按鈕 -->
      <div class="flex items-center gap-2 mx-2">
        <!-- 已登入：顯示用戶信息和登出按鈕 -->
        <template v-if="userStore.isLoggedIn">
          <!-- 用戶名稱（桌面版顯示） -->
          <span class="text-textBase gt-xs mx-2">
            {{ userStore.user?.name || userStore.user?.email || 'User' }}
          </span>

          <!-- 登出按鈕 -->
          <q-btn
            outline
            dense
            label="登出"
            icon="logout"
            color="primary"
            size="sm"
            @click="handleLogout"
          />
        </template>

        <!-- 未登入：顯示登入按鈕 -->
        <template v-else>
          <q-btn
            unelevated
            dense
            label="登入"
            icon="login"
            class="btn-gradient-primary"
            size="sm"
            @click="goToLogin"
          />
        </template>
      </div>
    </q-toolbar>
  </q-header>
</template>

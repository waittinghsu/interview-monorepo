<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()

// 初始化主題
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  background-color: var(--color-sys-page);
  color: var(--color-textBase);
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
}
</style>

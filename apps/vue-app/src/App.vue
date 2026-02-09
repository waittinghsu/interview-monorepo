<script setup>
// 初始化主題
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <router-view />
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--color-sys-background, #011e16);
  color: var(--color-textPrimary, #00da9b);
  transition: background-color 0.3s, color 0.3s;
}
</style>

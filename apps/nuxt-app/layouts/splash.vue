<script setup lang="ts">
// 空 layout，不顯示 header/footer
// 主要用於 loading 頁面（透過 routeRules 禁用 SSR）
</script>

<template>
  <div class="min-h-screen bg-sys-page">
    <slot />
  </div>
</template>

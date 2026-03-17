<script setup lang="ts">
</script>

<template>
  <q-footer class="bg-sys-card border-t border-sys-border">
    <div class="gt-sm container mx-auto text-center text-textMuted text-sm pt-4 px-4">
      <p class="my-1">
        &copy; {{ new Date().getFullYear() }} Interview Nuxt - Monorepo 練習專案
      </p>
      <p class="my-1">
        Built with Nuxt 3 + Quasar + TanStack Query + UnoCSS
      </p>
      <p class="mt-0">
        圖片版權歸各娛樂公司所有，本站僅供學習展示用途，無商業意圖。
      </p>
    </div>
    <!-- Mobile Bottom Tabs -->
    <AppBottomTabs class="lt-md" />
  </q-footer>
</template>

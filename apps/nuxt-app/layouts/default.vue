<script setup lang="ts">
const drawerOpen = ref(false)
</script>

<template>
  <q-layout view="hHh LpR fFf" class="bg-sys-page">
    <AppHeader @toggle-drawer="drawerOpen = !drawerOpen" />

    <AppDrawer v-model="drawerOpen" />

    <q-page-container>
      <q-page class="q-pa-md">
        <slot />
      </q-page>
    </q-page-container>
    <AppFooter />
    <!--    <q-footer class="bg-sys-card border-t border-sys-border"> -->
    <!--      &lt;!&ndash; Desktop Footer &ndash;&gt; -->
    <!--      <div class="gt-sm container mx-auto text-center text-textMuted text-sm py-4 px-4"> -->
    <!--        <p>&copy; {{ new Date().getFullYear() }} Interview Nuxt - Monorepo 練習專案</p> -->
    <!--        <p class="mt-1"> -->
    <!--          Built with Nuxt 3 + Quasar + TanStack Query + UnoCSS -->
    <!--        </p> -->
    <!--        <p class="mt-1"> -->
    <!--          圖片版權歸各娛樂公司所有，本站僅供學習展示用途，無商業意圖。 -->
    <!--        </p> -->
    <!--      </div> -->

    <!--      &lt;!&ndash; Mobile Bottom Tabs &ndash;&gt; -->
    <!--      <AppBottomTabs class="lt-md" /> -->
    <!--    </q-footer> -->
  </q-layout>
</template>

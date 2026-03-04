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

    <q-footer class="bg-sys-card border-t border-sys-border">
      <!-- Desktop Footer -->
      <div class="gt-sm container mx-auto text-center text-textMuted text-sm py-4 px-4">
        <p>&copy; {{ new Date().getFullYear() }} Interview Nuxt - Monorepo 練習專案</p>
        <p class="mt-1">
          Built with Nuxt 3 + Quasar + TanStack Query + UnoCSS
        </p>
      </div>

      <!-- Mobile Bottom Tabs -->
      <AppBottomTabs class="lt-md" />
    </q-footer>
  </q-layout>
</template>

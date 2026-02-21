<script setup>
// Layout 包含共用的頁面結構：Header + Container + Footer
const { isLoading, pendingCount } = useApiLoading()
const isDev = import.meta.env.DEV
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Global Loading Bar -->
    <q-linear-progress
      v-if="isLoading"
      indeterminate
      color="primary"
      class="fixed top-0 z-9999"
      size="3px"
    />

    <!-- Header -->
    <AppHeader />

    <!-- Main Content Container -->
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>

    <!-- Footer -->
    <AppFooter />

    <!-- Debug: API Loading State (DEV only) -->
    <div v-if="isDev && pendingCount > 0" class="fixed bottom-4 right-4 z-9999">
      <q-chip color="primary" text-color="white" icon="hourglass_empty">
        API Loading: {{ pendingCount }}
      </q-chip>
    </div>
  </q-layout>
</template>

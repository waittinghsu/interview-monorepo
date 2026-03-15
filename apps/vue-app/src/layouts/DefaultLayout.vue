<script setup>
const { isLoading } = useApiLoading()
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
  </q-layout>
</template>

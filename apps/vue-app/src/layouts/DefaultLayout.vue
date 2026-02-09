<script setup>
// Layout 包含共用的頁面結構：Header + Container + Footer
</script>

<template>
  <q-layout view="hHh lpR fFf">
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

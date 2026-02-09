<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-sys-background">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

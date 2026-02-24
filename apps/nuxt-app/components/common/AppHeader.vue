<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const emit = defineEmits<{
  toggleDrawer: []
}>()

const themeStore = useThemeStore()
</script>

<template>
  <q-header class="bg-sys-card border-b border-sys-border">
    <q-toolbar>
      <!-- 漢堡選單 -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        @click="emit('toggleDrawer')"
      />

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 no-underline">
        <div class="i-mdi-lightning-bolt text-2xl text-textBrand" />
        <span class="text-xl font-bold text-textBase gt-xs">Cyberpunk Studio</span>
      </NuxtLink>

      <q-space />

      <!-- 主題切換器 -->
      <q-select
        v-model="themeStore.currentThemeName"
        :options="themeStore.themeOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        dense
        outlined
        class="w-28 sm:w-40"
        @update:model-value="themeStore.setTheme"
      />
    </q-toolbar>
  </q-header>
</template>

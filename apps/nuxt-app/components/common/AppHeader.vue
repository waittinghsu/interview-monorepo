<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <header class="bg-sys-surface border-b border-sys-border py-3 px-4">
    <div class="container mx-auto flex-between">
      <NuxtLink to="/" class="text-xl font-bold text-primary">
        Interview Nuxt
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink to="/" class="text-textSecondary hover:text-primary transition-colors">
          首頁
        </NuxtLink>
        <NuxtLink to="/chart" class="text-textSecondary hover:text-primary transition-colors">
          圖表
        </NuxtLink>
        <NuxtLink to="/tic-tac-toe" class="text-textSecondary hover:text-primary transition-colors">
          圈圈叉叉
        </NuxtLink>
        <NuxtLink to="/number-guess" class="text-textSecondary hover:text-primary transition-colors">
          猜數字
        </NuxtLink>
        <NuxtLink to="/about" class="text-textSecondary hover:text-primary transition-colors">
          關於
        </NuxtLink>

        <!-- 主題切換 -->
        <q-select
          v-model="themeStore.currentThemeName"
          :options="themeStore.themeOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          class="w-32"
          @update:model-value="themeStore.setTheme"
        />
      </nav>
    </div>
  </header>
</template>

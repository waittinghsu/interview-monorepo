<script setup>
const router = useRouter()
const route = useRoute()

const isHome = computed(() => route.name === 'Home')
</script>

<template>
  <q-header elevated class="bg-sys-card border-b border-sys-border">
    <q-toolbar class="min-h-[52px] px-3">
      <!-- Back button（非首頁才顯示） -->
      <q-btn
        v-if="!isHome"
        flat
        round
        dense
        icon="arrow_back_ios"
        class="text-textSecondary mr-1"
        @click="router.back()"
      />

      <!-- Logo -->
      <router-link :to="{ name: 'Home' }" class="no-underline flex items-center gap-1.5">
        <q-icon name="music_note" size="1.4rem" class="text-primary" />
        <span class="text-textBase font-bold text-base tracking-wide">K-Pop</span>
        <span class="text-primary font-bold text-base">Hub</span>
      </router-link>

      <q-space />

      <!-- 搜尋按鈕（預留） -->
      <q-btn
        flat
        round
        dense
        icon="search"
        class="text-textSecondary"
      />
    </q-toolbar>
  </q-header>
</template>

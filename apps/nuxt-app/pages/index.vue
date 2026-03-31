<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// Carousel 資料
const slide = ref(0)
const carouselItems = [
  { title: 'Welcome to Cyberpunk', description: '探索未來科技的無限可能', image: '/carousel/D1.png' },
  { title: 'Modern Tech Stack', description: 'Nuxt 3 + Quasar + TanStack Query', image: '/carousel/D3.png' },
  { title: 'Responsive Design', description: '適配所有裝置的優雅體驗', image: '/carousel/D2.png' },
  { title: '圖片版權歸各娛樂公司所有', description: '本站僅供學習展示用途，無商業意圖。', image: '/carousel/D4.png' },
  { title: 'Monorepo ', description: '練習專案。', image: '/carousel/D5.png' },
  { title: '即時股票數據視覺化 ', description: '練習專案。', image: '/carousel/D6.png' },
  { title: 'API 測試 ', description: 'Transition Effects。', image: '/carousel/D7.png' },
]

// ActionCards 資料
interface ActionCard {
  id: number
  label: string
  icon: string
  route: string
  description: string
}

const actionCards: ActionCard[] = [
  { id: 1, label: '股票圖表', icon: 'i-mdi-chart-line', route: '/chart', description: '即時股票數據視覺化' },
  { id: 2, label: '圈圈叉叉', icon: 'i-mdi-gamepad-variant', route: '/tic-tac-toe', description: '經典井字遊戲對戰' },
  { id: 3, label: '猜數字', icon: 'i-mdi-numeric-4-box-multiple-outline', route: '/number-guess', description: '測試邏輯推理' },
  { id: 4, label: '會員資料', icon: 'i-mdi-account-circle', route: '/user-info', description: '管理個人資料' },
  { id: 5, label: '關於我們', icon: 'i-mdi-information', route: '/about', description: '了解本專案' },
  { id: 6, label: '郵件中心', icon: 'i-mdi-email', route: '/mail', description: '訊息管理' },
  { id: 7, label: 'API 測試', icon: 'i-mdi-api', route: '/api-demo', description: '測試三種 API 調用方式' },
  { id: 8, label: 'Transition Effects', icon: 'i-mdi-shimmer', route: '/transition-effects', description: '視覺過渡特效展示' },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Section 1: Carousel -->
    <section class="mb-12">
      <q-carousel
        v-model="slide"
        animated
        swipeable
        arrows
        navigation
        infinite
        :autoplay="5000"
        height="400px"
        class="rounded-lg overflow-hidden shadow-lg"
      >
        <q-carousel-slide
          v-for="(item, index) in carouselItems"
          :key="index"
          :name="index"
          :style="{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
          class="flex-center flex-col gap-4 relative"
        >
          <div class="absolute inset-0 bg-black/50" />
          <div class="text-center relative z-10">
            <h2 class="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {{ item.title }}
            </h2>
            <p class="text-xl text-white/90 drop-shadow-md">
              {{ item.description }}
            </p>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </section>

    <!-- Section 2: 兩欄佈局 -->
    <section class="container mx-auto px-4 mb-16">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- 左：Title + Description -->
        <div>
          <h2 class="text-3xl font-bold text-textBase mb-4">
            關於 Cyberpunk Studio
          </h2>
          <p class="text-textSecondary leading-relaxed mb-4">
            這是一個展示現代化前端技術的專案，採用 Nuxt 3、Quasar、TanStack Query 和 UnoCSS 打造。
          </p>
          <p class="text-textSecondary leading-relaxed mb-4">
            支援 SSR + CSR 混合渲染，動態主題切換，並整合 Pinia 狀態管理。
          </p>
          <p class="text-textSecondary leading-relaxed">
            所有功能都遵循最佳實踐，提供完整的型別安全與開發體驗。
          </p>
        </div>

        <!-- 右：圖表佔位符 -->
        <div class="bg-sys-card rounded-lg p-6 border border-sys-border flex-center flex-col gap-4">
          <CyberCircle :size="140" color="#f97316" :progress="85" />
          <p class="text-textMuted">
            圖表佔位符
          </p>
          <p class="text-textSecondary text-sm text-center">
            未來將整合即時數據視覺化功能
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: ActionCards 網格 -->
    <section class="container mx-auto px-4 mb-16">
      <h2 class="text-3xl font-bold text-textBase mb-8 text-center">
        探索功能
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="card in actionCards"
          :key="card.id"
          :to="card.route"
          class="action-card no-underline"
        >
          <div class="card-content">
            <!--            <CyberRadar :size="250" color="#22d3ee" /> -->
            <div :class="card.icon" class="text-5xl text-textBrand mb-4" />
            <h3 class="text-xl font-bold text-textBase mb-2">
              {{ card.label }}
            </h3>
            <p class="text-textSecondary text-sm">
              {{ card.description }}
            </p>
          </div>
        </NuxtLink>
        <div class="action-card no-underline">
          <div class="card-content">
            <CyberRadar :size="250" color="#22d3ee" />
          </div>
        </div>
        <div class="action-card no-underline">
          <div class="card-content">
            <CyberPulse :size="250" :rings="3" color="#f87171" />
          </div>
        </div>
        <div class="action-card no-underline">
          <div class="card-content pa-3">
            <CyberCrosshair :size="200" :locked="true" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.action-card {
  @apply bg-sys-raised rounded-lg p-6 border-2 border-sys-border;
  @apply transition-all duration-300;
}

.action-card:hover {
  @apply border-textBrand;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
  transform: translateY(-4px);
}

.action-card:hover .card-content {
  @apply opacity-90;
}

.card-content {
  @apply flex flex-col items-center text-center;
}
</style>

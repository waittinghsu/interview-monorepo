<script setup>
const router = useRouter()

// 輪播圖資料（後期改為 mock API）
const carouselSlides = ref([
  { id: 1, image: '/images/home/carousel/one_ok_rock.jpg', title: 'ONE OK ROCK' },
  { id: 2, image: '/images/home/carousel/fx.jpg', title: 'f(x)' },
  { id: 3, image: '/images/home/carousel/cxm.jpg', title: 'CXM' },
  { id: 4, image: '/images/home/carousel/gem.jpg', title: 'G.E.M.' },
  { id: 5, image: '/images/home/carousel/readom.jpg', title: 'Readom' },
  { id: 6, image: '/images/home/carousel/zpp.jpg', title: 'ZPP' },
])
const carouselSlide = ref(1)

// 公告資料（後期改為 mock API）
const notices = ref([
  '歡迎來到 Interview Vue 練習專案！',
  '本專案使用 Vue 3 + Vite + Pinia + Quasar + UnoCSS',
  '支援動態主題切換，快試試看右上角的主題選擇器！',
])
const currentNoticeIndex = ref(0)
const noticeEl = ref(null)

// 跑馬燈動畫
function updateNoticeAnimation() {
  if (!noticeEl.value)
    return
  noticeEl.value.style.animation = 'none'
  void noticeEl.value.offsetWidth
  noticeEl.value.style.animation = 'marquee 8s linear forwards'
}

onMounted(() => {
  setTimeout(updateNoticeAnimation, 100)
  setInterval(() => {
    currentNoticeIndex.value = (currentNoticeIndex.value + 1) % notices.value.length
    updateNoticeAnimation()
  }, 9000)
})

// Action Buttons 資料
const actionButtons = ref([
  { id: 1, icon: '/images/home/actionButtons/deposit.png', label: '座位表', routeName: 'SeatGrid' },
  { id: 2, icon: '/images/home/actionButtons/withdraw.png', label: '輪盤', routeName: 'SeatRotate' },
  { id: 3, icon: '/images/home/actionButtons/bonus.png', label: '抽獎', routeName: 'Home' },
  { id: 4, icon: '/images/home/actionButtons/promo.png', label: '優惠', routeName: 'Home' },
  { id: 5, icon: '/images/home/actionButtons/message.png', label: '訊息', routeName: 'Home' },
  { id: 6, icon: '/images/home/actionButtons/share.png', label: '關於', routeName: 'About' },
])

// Grid 區塊資料（後期會放隨機圖）
const gridItems = ref([
  { id: 1, color: 'bg-gradient-to-br from-red-400 to-red-600', label: '座位表', routeName: 'SeatGrid' },
  { id: 2, color: 'bg-gradient-to-br from-orange-400 to-orange-600', label: '座位輪盤', routeName: 'SeatRotate' },
  { id: 3, color: 'bg-gradient-to-br from-green-400 to-green-600', label: '關於我們', routeName: 'About' },
  { id: 4, color: 'bg-gradient-to-br from-blue-400 to-blue-600', label: '圈圈叉叉', routeName: 'TicTacToe' },
  { id: 5, color: 'bg-gradient-to-br from-purple-400 to-purple-600', label: '股票圖表', routeName: 'Chart' },
  { id: 6, color: 'bg-gradient-to-br from-pink-400 to-pink-600', label: '功能三', routeName: 'Home' },
  { id: 7, color: 'bg-gradient-to-br from-cyan-400 to-cyan-600', label: '功能四', routeName: 'Home' },
  { id: 8, color: 'bg-gradient-to-br from-amber-400 to-amber-600', label: '功能五', routeName: 'Home' },
  { id: 9, color: 'bg-gradient-to-br from-teal-400 to-teal-600', label: '功能六', routeName: 'Home' },
  { id: 10, color: 'bg-gradient-to-br from-indigo-400 to-indigo-600', label: '功能七', routeName: 'Home' },
  { id: 11, color: 'bg-gradient-to-br from-rose-400 to-rose-600', label: '功能八', routeName: 'Home' },
])

function navigateTo(routeName) {
  router.push({ name: routeName })
}
</script>

<template>
  <!-- 手機模擬容器 -->
  <div class="flex justify-center h-full py-4">
    <div class="w-[375px] bg-sys-background-light rounded-2xl overflow-hidden shadow-xl">
      <!-- 1. 輪播圖 Section -->
      <section class="carousel-section">
        <q-carousel
          v-model="carouselSlide"
          animated
          arrows
          navigation
          infinite
          transition-prev="slide-right"
          transition-next="slide-left"
          class="rounded-none h-[200px]"
        >
          <q-carousel-slide
            v-for="slide in carouselSlides"
            :key="slide.id"
            :name="slide.id"
            class="p-0"
          >
            <img
              :src="slide.image"
              :alt="slide.title"
              class="w-full h-full object-contain bg-sys-background-light"
            >
          </q-carousel-slide>
        </q-carousel>
      </section>

      <!-- 2. 公告跑馬燈 Section -->
      <section class="announcement-section">
        <div class="flex items-center bg-gradient-to-r from-transparent via-primary-700 to-transparent py-2">
          <q-icon name="campaign" class="ml-3 mr-2 text-secondary" size="1.2rem" />
          <div class="overflow-hidden flex-1 mr-3">
            <div
              ref="noticeEl"
              :key="currentNoticeIndex"
              class="notice-line whitespace-nowrap text-sm text-textPrimary"
            >
              {{ notices[currentNoticeIndex] }}
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Action Buttons Section -->
      <section class="action-buttons-section px-3 py-4">
        <div class="grid grid-cols-6 gap-2">
          <div
            v-for="btn in actionButtons"
            :key="btn.id"
            class="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="navigateTo(btn.routeName)"
          >
            <div class="w-12 h-12 rounded-full bg-sys-surface flex-center overflow-hidden">
              <img :src="btn.icon" :alt="btn.label" class="w-8 h-8 object-contain">
            </div>
            <span class="text-xs text-textSecondary mt-1">{{ btn.label }}</span>
          </div>
        </div>
      </section>

      <!-- 4. Grid 區塊 Section -->
      <section class="grid-section px-3 pb-4">
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="item in gridItems"
            :key="item.id"
            class="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform flex-center" :class="[item.color]"
            @click="navigateTo(item.routeName)"
          >
            <span class="text-white text-sm font-bold text-center px-2">
              {{ item.label }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.notice-line {
  display: inline-block;
  animation: marquee 8s linear forwards;
  will-change: transform;
}
</style>

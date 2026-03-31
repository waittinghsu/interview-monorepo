<script setup>
import GroupCard from '@/components/group/GroupCard.vue'
import CarouselBanner from '@/components/home/CarouselBanner.vue'
import CompanySlider from '@/components/home/CompanySlider.vue'
import MarqueeBanner from '@/components/home/MarqueeBanner.vue'
import { companies, getGroupsByCompany } from '@/data/kpop.js'

const router = useRouter()

const carouselSlides = [
  {
    id: 1,
    image: '/images/home/carousel/26_twice.jpg',
    title: 'TWICE',
    subtitle: 'JYP Entertainment',
    colorFrom: '#ff6b9d',
    colorTo: '#ff8e53',
  },
  {
    id: 2,
    image: '/images/home/carousel/26_day6.jpg',
    title: 'Day6',
    subtitle: 'JYP Entertainment',
    colorFrom: '#f59e0b',
    colorTo: '#10b981',
  },
  {
    id: 3,
    image: '/images/home/carousel/26_jm2026.jpg',
    title: 'K-Pop Hub',
    subtitle: '探索你喜愛的 K-pop 團體',
    colorFrom: '#7c3aed',
    colorTo: '#2563eb',
  },
  {
    id: 4,
    image: '',
    title: 'BTS',
    subtitle: 'HYBE Labels',
    colorFrom: '#4f46e5',
    colorTo: '#7c3aed',
  },
  {
    id: 5,
    image: '',
    title: 'BLACKPINK',
    subtitle: 'YG Entertainment',
    colorFrom: '#ec4899',
    colorTo: '#374151',
  },
]

const marqueeMessages = [
  '歡迎來到 K-Pop Hub！探索你最愛的韓流偶像 ✨',
  'TWICE 出道 10 週年，粉絲見面會全球巡迴中 🎉',
  'NewJeans 新單曲登上 Billboard Global 排行榜 🏆',
  'aespa 世界巡迴演唱會亞洲場開票中，趕快搶票！',
  'Stray Kids 連續登頂 Billboard 200 冠軍 🔥',
  'BTS 全員退伍！2025 完整體回歸！ARMY 期待已久 💜',
]

const selectedCompanyId = ref(companies[0].id)

const displayedGroups = computed(() =>
  getGroupsByCompany(selectedCompanyId.value),
)

function onCompanySelect(id) {
  selectedCompanyId.value = id
}

function goToGroup(groupId) {
  router.push({ name: 'Group', params: { id: groupId } })
}
</script>

<template>
  <div class="flex justify-center min-h-full -mx-4 -mt-4">
    <div class="w-full max-w-[480px]">
      <!-- 1. 輪播圖 -->
      <section>
        <CarouselBanner :slides="carouselSlides" />
      </section>

      <!-- 2. 公告跑馬燈 -->
      <section>
        <MarqueeBanner :messages="marqueeMessages" />
      </section>

      <!-- 3. 娛樂公司 水平滑動 -->
      <section>
        <div class="px-4 pt-4 pb-0">
          <h2 class="text-[11px] font-semibold text-textMuted uppercase tracking-widest m-0">
            娛樂公司
          </h2>
        </div>
        <CompanySlider
          :companies="companies"
          :active-id="selectedCompanyId"
          @select="onCompanySelect"
        />
      </section>

      <!-- 4. 旗下團體 Grid -->
      <section class="px-4 pb-6">
        <div class="flex items-center gap-2 mb-3">
          <h2 class="text-textBase text-sm font-bold m-0">
            旗下團體
          </h2>
          <span
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sys-raised text-textMuted"
          >
            {{ displayedGroups.length }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <GroupCard
            v-for="group in displayedGroups"
            :key="group.id"
            :group="group"
            @click="goToGroup"
          />
        </div>
      </section>
    </div>
  </div>
</template>

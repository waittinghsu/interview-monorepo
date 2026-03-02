<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({
  layout: 'default',
  title: 'Resume - WeiTing Hsu',
  ssr: false, // Disable SSR for GSAP animations
})

// SEO optimization
useHead({
  title: 'Resume - WeiTing Hsu',
  meta: [
    { name: 'description', content: 'WeiTing Hsu\'s professional resume - 資深前端工程師 with 15+ years of experience in Vue.js, Nuxt, React, and full-stack development.' },
    { property: 'og:title', content: 'Resume - WeiTing Hsu' },
    { property: 'og:description', content: '資深前端工程師 with expertise in Vue.js, Nuxt, TypeScript, and modern frontend architectures.' },
  ],
})

interface PersonalInfo {
  name: string
  title: string
  location: string
  email?: string
  github?: string
  linkedin?: string
}

interface WorkExperience {
  id: number
  company: string
  title: string
  period: string
  duties: string[]
}

interface Education {
  id: number
  degree: string
  school: string
  period: string
  major: string
}

interface SkillCategory {
  name: string
  items: string[]
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

const personalInfo: PersonalInfo = {
  name: 'WeiTing Hsu',
  title: '資深前端工程師',
  location: 'Taipei, 台灣',
  email: undefined,
  github: 'https://github.com/waittinghsu',
  linkedin: 'https://www.linkedin.com/in/waitting-hsu-1231481a4/',
}

const summary = '持續專注於新技術研究,善於分析並解決問題,曾成功提出多項高效解決方案以優化團隊研發流程。自2010年踏入網站工程師職涯以來,我一直保持著學習的心態。積極參與團隊協作,善於與同事和同好分享及討論程式設計架構概念,並逐漸提升共同進步。憑藉前後端實作經驗,能有效溝通需求並降低協作成本。'

const workExperience: WorkExperience[] = [
  {
    id: 1,
    company: '辰星資訊有限公司',
    title: '前端工程師',
    period: '2025/03 - Present',
    duties: [
      '主導前端架構設計與落地，採用 Nuxt 3 + Quasar + Pinia 建立 SPA / Hybrid App 的開發模式與專案基礎建設',
      '建立可複用的 Composables 與全域元件系統，制定元件開發規範，提升跨模組的一致性與可維護性',
      '導入 TanStack Vue Query，統一 API 資料存取、快取與錯誤處理模式',
      '以 UnoCSS 搭配 Design Tokens 規劃多主題架構，定義清晰的 theme 邊界以支援多品牌切換與獨立打包',
      '導入 TypeScript 與 ESLint，建立一致的程式碼規範與型別檢查流程',
      '基於 Capacitor 開發 Android/WEB 混合應用，整合推播通知、剪貼簿、狀態列等原生能力',
      '整合 Socket.IO 即時事件通知，封裝連線狀態與重連機制',
    ],
  },
  {
    id: 2,
    company: '紅石資訊有限公司',
    title: '前端工程師',
    period: '2020/11 - 2025/03',
    duties: [
      '主導前端框架的系統整合和技術革新，領導 3 人團隊，並擔任 Code Review 的角色',
      '建立並落實前端程式碼規範與開發流程（可讀性、可擴展性、可維護性）',
      '與後端協作制定 API 格式與規範，導入並推廣 YAPI 作為 API 文件與 Mock 管理工具',
      '整合公司內多套後台管理系統的共用模組與開發流程，降低維護成本並提升新專案啟動速度',
      '推動使用 Axure 原型圖繪製軟體，透過原型圖與用戶端溝通',
      '規劃並撰寫 GitLab Runner / CI 腳本，推動前端建置與部署流程自動化',
      '維護既有 Vue / React 系統，持續進行重構、效能與體驗優化',
    ],
  },
  {
    id: 3,
    company: '華奧科技股份有限公司',
    title: 'Vue Front-end Developer',
    period: '2019/11 - 2020/10',
    duties: [
      '建立及優化團隊工作流程，組織跨團隊合作，主責專案管理人數 7 人',
      '負責專案早期評估前端架構和配置，協助研究技術和提供解決方案',
      '規劃並重構系統，提升可維護性與可閱讀性',
      '開發聊天室模組增加使用者間的互動',
      '開發視訊直播模組',
      '導入 YAPI 管理系統並開發程式碼轉換器腳本，以節省成員串接 API 所花費的時間',
      '導入 i18n 多語言系統，並開發 Google Sheets 轉換腳本',
      '密集與後端討論 API 規格並共同維護 YAPI 管理系統',
      '導入微服務前端架構快速抽換前端元件',
    ],
  },
  {
    id: 4,
    company: '家豪科技有限公司',
    title: '全端工程師',
    period: '2017/03 - 2019/09',
    duties: [
      '從零規劃並建置前端架構（Nuxt SSR/SPA 規劃、路由與版型結構），建立專案基礎',
      '開發響應式頁面與共用 UI 元件，確保跨裝置體驗一致並提升團隊開發效率',
      '運用 Element-UI 與 iView 協助開發高效客製化元件',
      '善用第三方元件來開發功能（聊天室模組）',
      '與設計師協作（Sketch / InVision）討論互動與畫面可行性，降低重工成本',
      '參與後端 API 設計與串接，協助前後端介面對齊',
      '主導 UI 框架改版與遷移（Semantic / Bootstrap → Vuetify），提升一致性與維護性',
    ],
  },
  {
    id: 5,
    company: '台灣大哥大股份有限公司 電子資訊服務處',
    title: '後端工程師',
    period: '2014/11 - 2017/03',
    duties: [
      '負責電商後端功能開發與維護，涵蓋購物折價券、會員系統、商品上下架等核心模組',
      '規劃與維護資料庫結構與資料流程，確保功能迭代時的資料一致性與可追溯性',
      '串接第三方 API，並建立/維護排程（批次作業）以支援營運需求與系統整合',
      '維護既有系統架構，處理線上問題並持續進行效能與穩定性優化',
      '與跨部門團隊（如前端、PM、營運）協作釐清需求，落實功能與交付',
      '設計並實作折價券規則與使用限制邏輯，確保結帳流程正確性與可維護性',
    ],
  },
  {
    id: 6,
    company: 'AH SOLUTION',
    title: 'Full Stack Developer',
    period: '2014/07 - 2014/11',
    duties: [
      '前端畫面切版，動畫特效製作',
      '後端程式邏輯開發：抽獎系統、客源分析統計',
      '串接 Facebook API',
      '舊有架構維護以及效能優化',
      'Database 欄位規劃',
    ],
  },
]

const education: Education[] = [
  {
    id: 1,
    degree: '碩士學位',
    school: '國立虎尾科技大學',
    period: '2010 - 2013',
    major: '資訊工程系 Computer Science & Information Engineering',
  },
  {
    id: 2,
    degree: '學士學位',
    school: '國立虎尾科技大學',
    period: '2006 - 2010',
    major: '資訊工程系 Computer Science & Information Engineering',
  },
]

const skills: SkillCategory[] = [
  {
    name: 'Core (Front-end)',
    items: ['Vue 2 / Vue 3', 'Nuxt', 'Vue Router', 'Pinia / Vuex', 'React', 'TypeScript', 'JavaScript (ES6+)', 'Quasar', 'Element-UI', 'Vuetify', 'Bootstrap', 'TanStack Vue Query', 'Axios', 'Capacitor', 'ECharts'],
  },
  {
    name: 'CSS / UI',
    items: ['UnoCSS', 'Tailwind CSS', 'SCSS/Sass', 'RWD', 'BEM', 'Design Tokens / Theming'],
  },
  {
    name: 'Code Quality / Tooling',
    items: ['ESLint', 'Prettier', 'Storybook', 'Git', 'CI/CD (GitLab Runner)', 'Jenkins'],
  },
  {
    name: 'Backend & Database (協作/實作經驗)',
    items: ['PHP (Laravel / CodeIgniter / Phalcon)', 'MySQL / MSSQL / MongoDB', 'RESTful API / 第三方 API 串接 (GA/Maps/Sheets/Telegram...)'],
  },
]

const achievements: Achievement[] = [
  {
    id: 1,
    title: '15+ 年經驗',
    description: '自2010年踏入網站工程師職涯,累積豐富的前後端開發經驗',
    icon: 'i-mdi-calendar-star',
    color: 'text-primary',
  },
  {
    id: 2,
    title: '團隊領導',
    description: '管理過 1-8 人的前端團隊,負責技術決策與成員培育',
    icon: 'i-mdi-account-group',
    color: 'text-secondary',
  },
  {
    id: 3,
    title: '架構設計',
    description: '主導多個大型專案的前端架構,包含 Nuxt SSR、Monorepo 等',
    icon: 'i-mdi-sitemap',
    color: 'text-cyber-purple',
  },
  {
    id: 4,
    title: '效能優化',
    description: 'CI/CD 自動化縮短部署時間 80%,提升團隊研發效率',
    icon: 'i-mdi-speedometer',
    color: 'text-cyber-amber',
  },
]

// Animation setup
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // 簡單的淡入動畫函數
  const createFadeIn = (selector: string, options: { delay?: number, stagger?: number } = {}) => {
    const elements = document.querySelectorAll(selector)
    if (elements.length === 0)
      return

    elements.forEach((element, index) => {
      gsap.from(element, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: options.delay || 0 + (index * (options.stagger || 0)),
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      })
    })
  }

  // 1. Hero Section - 自動淡入
  gsap.from('.hero-section', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.2,
    ease: 'power2.out',
  })

  // 2. Work Experience 卡片
  createFadeIn('.work-card', { stagger: 0.15 })

  // 3. Education & Skills
  createFadeIn('.education-card, .skills-card', { stagger: 0.15 })

  // 4. Achievements
  createFadeIn('.achievement-card', { stagger: 0.1 })
})

// Cleanup ScrollTrigger instances on unmount
onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
  <div class="resume-wrapper min-h-screen bg-sys-page text-textBase">
    <!-- Hero Section with Summary -->
    <section class="hero-section relative overflow-hidden bg-gradient-to-b from-sys-page to-sys-card py-12 md:py-16">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary blur-3xl" />
        <div class="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary blur-3xl" />
      </div>

      <div class="container relative mx-auto max-w-6xl px-3 md:px-4">
        <!-- Desktop: Left-Right Layout, Mobile: Stacked -->
        <div class="flex flex-col gap-8 md:flex-row md:items-start">
          <!-- Left: Avatar + Personal Info -->
          <div class="flex flex-col items-center md:w-80 md:shrink-0">
            <!-- Avatar -->
            <div class="mb-6">
              <img
                src="/images/resume/avatar.jpg"
                alt="WeiTing Hsu"
                class="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-primary/20 md:h-32 md:w-32"
              >
            </div>

            <!-- Name & Title -->
            <div class="w-full text-center">
              <h1 class="mb-2 text-3xl font-bold text-textBase md:text-4xl">
                {{ personalInfo.name }}
              </h1>
              <p class="mb-1 text-lg text-primary md:text-xl">
                {{ personalInfo.title }}
              </p>
              <p class="text-base text-textSecondary">
                @ 辰星資訊有限公司
              </p>

              <!-- Location -->
              <div class="mt-4 flex items-center justify-center gap-2 text-textSecondary">
                <i class="i-mdi-map-marker text-primary" />
                <span>{{ personalInfo.location }}</span>
              </div>

              <!-- Social Links -->
              <div class="mt-4 flex justify-center gap-3">
                <q-btn
                  v-if="personalInfo.linkedin"
                  round
                  flat
                  icon="i-mdi-linkedin"
                  size="lg"
                  class="bg-white/5 text-textSecondary hover:bg-primary/20 hover:text-primary"
                  :href="personalInfo.linkedin"
                  target="_blank"
                />
                <q-btn
                  v-if="personalInfo.github"
                  round
                  flat
                  icon="i-mdi-github"
                  size="lg"
                  class="bg-white/5 text-textSecondary hover:bg-primary/20 hover:text-primary"
                  :href="personalInfo.github"
                  target="_blank"
                />
              </div>
            </div>
          </div>

          <!-- Right: Professional Summary (Full width on mobile) -->
          <div class="flex-1">
            <div class="rounded-2xl bg-sys-card/50 p-6 backdrop-blur-sm md:p-8">
              <p class="text-base leading-relaxed text-textSecondary md:text-lg">
                {{ summary }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto max-w-6xl px-3 py-8 md:px-4 md:py-12">
      <!-- Work Experience -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold text-textBase">
          Work Experience
        </h2>
        <div class="space-y-6">
          <q-card
            v-for="work in workExperience"
            :key="work.id"
            class="work-card group transition-all duration-300 hover:translate-x-2"
          >
            <q-card-section class="relative pl-5 pr-4 pt-4">
              <!-- Left Border Accent -->
              <div class="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-gradient-to-b from-primary to-secondary" />

              <!-- Icon Badge -->
              <div class="mb-4 flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/20 md:h-12 md:w-12">
                  <i class="i-mdi-briefcase text-xl text-primary md:text-2xl" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="text-lg font-bold text-textBase md:text-xl">
                    {{ work.title }}
                  </h3>
                  <p class="text-base font-semibold text-primary md:text-lg">
                    {{ work.company }}
                  </p>
                  <p class="text-xs text-textMuted md:text-sm">
                    {{ work.period }}
                  </p>
                </div>
              </div>

              <!-- Duties List -->
              <div class="ml-0 space-y-2 md:ml-16">
                <div
                  v-for="(duty, dutyIndex) in work.duties"
                  :key="dutyIndex"
                  class="flex items-start gap-3 text-textSecondary"
                >
                  <i class="i-mdi-chevron-right mt-1 shrink-0 text-primary" />
                  <span>{{ duty }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </section>

      <!-- Education & Skills Grid -->
      <div class="mb-8 grid gap-6 md:mb-12 md:grid-cols-2 md:gap-8">
        <!-- Education -->
        <section class="education-card min-w-0">
          <q-card class="cyber-card h-full overflow-hidden">
            <q-card-section class="overflow-hidden">
              <h2 class="mb-6 text-2xl font-bold text-textBase">
                Education
              </h2>
              <div class="space-y-6">
                <div v-for="edu in education" :key="edu.id" class="border-l-2 border-primary pl-4">
                  <h3 class="text-lg font-semibold text-textBase">
                    {{ edu.degree }}
                  </h3>
                  <p class="text-textSecondary">
                    {{ edu.school }}
                  </p>
                  <p class="text-sm text-textMuted">
                    {{ edu.period }}
                  </p>
                  <p class="mt-1 text-sm text-textSecondary">
                    {{ edu.major }}
                  </p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </section>

        <!-- Skills -->
        <section class="skills-card min-w-0">
          <q-card class="cyber-card h-full overflow-hidden">
            <q-card-section class="overflow-hidden">
              <h2 class="mb-6 text-2xl font-bold text-textBase">
                Skills
              </h2>
              <div class="space-y-6">
                <div v-for="category in skills" :key="category.name" class="min-w-0">
                  <h3 class="mb-3 overflow-hidden text-ellipsis text-lg font-semibold text-primary">
                    {{ category.name }}
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <q-chip
                      v-for="skill in category.items"
                      :key="skill"
                      class="max-w-full overflow-hidden text-ellipsis whitespace-nowrap bg-white/10 text-xs text-textBase md:text-sm"
                    >
                      <span class="overflow-hidden text-ellipsis">{{ skill }}</span>
                    </q-chip>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </section>
      </div>

      <!-- Notable Achievements -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold text-textBase">
          Notable Achievements
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <q-card
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card cyber-card text-center transition-transform hover:scale-105"
          >
            <q-card-section>
              <div class="mb-4 flex justify-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <i class="text-3xl" :class="[achievement.icon, achievement.color]" />
                </div>
              </div>
              <h3 class="mb-2 text-xl font-bold text-textBase">
                {{ achievement.title }}
              </h3>
              <p class="text-sm text-textSecondary">
                {{ achievement.description }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.resume-wrapper {
  background: linear-gradient(180deg, var(--color-sys-page) 0%, var(--color-sys-card) 100%);
}

.hero-section {
  background: linear-gradient(180deg, var(--color-sys-page), var(--color-sys-card));
}

/* 粒子聚合動畫初始狀態 */
.hero-section,
.work-card,
.cyber-card {
  /* GSAP 會覆蓋這些屬性，這裡只是防止 FOUC */
  will-change: transform, opacity, filter;
}

.cyber-card {
  background: color-mix(in srgb, var(--color-sys-card) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-sys-border) 45%, transparent);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 45px rgba(5, 11, 30, 0.55);
}

.work-card {
  background: color-mix(in srgb, var(--color-sys-card) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-sys-border) 35%, transparent);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(5, 11, 30, 0.4);
  overflow: hidden;
  position: relative;
}

.work-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-action), var(--color-secondary), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.work-card:hover::before {
  opacity: 1;
}

.work-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
  box-shadow: 0 12px 48px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.1);
}

/* Print Styles */
@media print {
  .resume-wrapper {
    background: white;
    color: black;
  }

  .hero-section {
    background: white;
    page-break-after: avoid;
  }

  .cyber-card {
    background: white;
    border: 1px solid #e0e0e0;
    box-shadow: none;
    page-break-inside: avoid;
  }

  .work-timeline :deep(.q-timeline__dot) {
    background: #22d3ee;
    box-shadow: none;
  }

  .text-textBase,
  .text-textSecondary,
  .text-textMuted {
    color: black !important;
  }

  .text-primary,
  .text-secondary,
  .text-cyber-purple,
  .text-cyber-amber {
    color: #22d3ee !important;
  }

  /* Remove animations in print */
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>

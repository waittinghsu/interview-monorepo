<script setup lang="ts">
import type { PopupTask } from '~/features/popup'
import gsap from 'gsap'
import { usePopupStore } from '~/stores/popup'

definePageMeta({ layout: 'default', title: '彈窗示範' })

const popupStore = usePopupStore()

const MOCK_TASKS: PopupTask[] = [
  {
    key: 'text-announcement',
    name: '系統公告',
    priority: 50,
    displayRule: 'unlimited',
    component: 'PopupTextAnnouncement',
    extra: { message: '歡迎使用彈窗系統！這是一則純文字公告，點擊「是」可前往連結。', url: 'https://example.com' },
  },
  {
    key: 'image-button',
    name: '限時優惠',
    priority: 40,
    displayRule: 'once_daily',
    component: 'PopupImageButton',
    extra: { title: '今日限時折扣！', description: '全場商品 5 折起，機不可失！' },
  },
  {
    key: 'roulette',
    name: '幸運輪盤',
    priority: 100,
    displayRule: 'once_weekly',
    component: 'PopupRoulette',
    extra: {},
  },
  {
    key: 'tic-tac-toe',
    name: '益智遊戲',
    priority: 60,
    displayRule: 'unlimited',
    component: 'PopupTicTacToe',
    extra: {},
  },
  {
    key: 'cyber',
    name: 'CYBER STATUS',
    priority: 70,
    displayRule: 'once_per_login',
    component: 'PopupCyber',
    extra: { subtitle: 'ALL SYSTEMS NOMINAL' },
  },
  {
    key: 'form-input',
    name: '填寫資料',
    priority: 1,
    displayRule: 'unlimited',
    component: 'PopupFormInput',
    extra: { placeholder: '請輸入您的手機號碼' },
  },
  {
    key: 'image-disintegrate',
    name: '消散特效',
    priority: 30,
    displayRule: 'unlimited',
    component: 'PopupImageDisintegrate',
    extra: { imageAlt: '點擊 X 觸發消散動畫' },
  },
]

const BUTTON_CONFIGS = [
  { task: MOCK_TASKS[0], label: '公告', icon: 'i-mdi-bullhorn', color: 'bg-blue-500' },
  { task: MOCK_TASKS[1], label: '圖片', icon: 'i-mdi-image', color: 'bg-green-500' },
  { task: MOCK_TASKS[2], label: '輪盤 ★', icon: 'i-mdi-slot-machine', color: 'bg-red-500' },
  { task: MOCK_TASKS[3], label: '遊戲', icon: 'i-mdi-gamepad-variant', color: 'bg-purple-500' },
  { task: MOCK_TASKS[4], label: 'Cyber', icon: 'i-mdi-orbit', color: 'bg-cyan-500' },
  { task: MOCK_TASKS[5], label: '表單 ↓', icon: 'i-mdi-form-textbox', color: 'bg-orange-500' },
  { task: MOCK_TASKS[6], label: '消散', icon: 'i-mdi-shimmer', color: 'bg-violet-500' },
]

const pendingTasks = ref<PopupTask[]>([])
const countdown = ref(0)
const countdownEl = ref<HTMLElement | null>(null)
let countdownInterval: ReturnType<typeof setInterval> | null = null
let beatTween: gsap.core.Tween | null = null

function addTask(task: PopupTask) {
  if (!pendingTasks.value.some(t => t.key === task.key)) {
    pendingTasks.value.push(task)
  }
  resetCountdown()
}

function resetCountdown() {
  if (countdownInterval)
    clearInterval(countdownInterval)
  countdown.value = 10
  startBeat()

  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
      stopBeat()
      launchPopups()
    }
  }, 1000)
}

function launchPopups() {
  pendingTasks.value.forEach(t => popupStore.insert(t))
  pendingTasks.value = []
  countdown.value = 0
}

function startBeat() {
  if (!countdownEl.value)
    return
  beatTween?.kill()
  beatTween = gsap.to(countdownEl.value, {
    scale: 1.3,
    duration: 0.3,
    ease: 'power2.out',
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.7,
  })
}

function stopBeat() {
  beatTween?.kill()
  beatTween = null
  if (countdownEl.value) {
    gsap.set(countdownEl.value, { scale: 1 })
  }
}

onUnmounted(() => {
  if (countdownInterval)
    clearInterval(countdownInterval)
  beatTween?.kill()
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-textBase mb-2">
      彈窗示範
    </h1>
    <p class="text-textSecondary text-sm mb-8">
      點擊按鈕加入任務，10 秒後按 priority 依序彈出（輪盤 100 最優先）
    </p>

    <!-- Task buttons -->
    <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
      <button
        v-for="cfg in BUTTON_CONFIGS"
        :key="cfg.task.key"
        class="flex flex-col items-center gap-2 p-4 rounded-2xl text-white transition-all active:scale-95"
        :class="[
          cfg.color,
          pendingTasks.some(t => t.key === cfg.task.key) ? 'ring-4 ring-white ring-opacity-60 scale-105' : 'opacity-90 hover:opacity-100',
        ]"
        @click="addTask(cfg.task)"
      >
        <div :class="cfg.icon" class="text-2xl" />
        <span class="text-xs font-semibold">{{ cfg.label }}</span>
        <span class="text-xs opacity-70">P:{{ cfg.task.priority }}</span>
      </button>
    </div>

    <!-- Pending tasks & countdown -->
    <transition name="fade">
      <div v-if="pendingTasks.length > 0" class="bg-sys-raised rounded-2xl p-5 border border-sys-border">
        <div class="flex items-center justify-between mb-3">
          <span class="text-textSecondary text-sm font-medium">待執行任務 ({{ pendingTasks.length }})</span>
          <div class="flex items-center gap-2">
            <span class="text-textMuted text-xs">倒數</span>
            <span ref="countdownEl" class="text-2xl font-bold text-primary inline-block">{{ countdown }}</span>
            <span class="text-textMuted text-xs">秒</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="t in pendingTasks"
            :key="t.key"
            class="flex items-center gap-1 bg-sys-card rounded-lg px-3 py-1 text-sm text-textBase border border-sys-border"
          >
            <span>{{ t.name }}</span>
            <span class="text-xs text-primary font-bold">P:{{ t.priority }}</span>
          </div>
        </div>

        <q-btn
          flat
          dense
          label="立即執行"
          class="mt-3 text-primary text-xs"
          @click="launchPopups"
        />
      </div>
    </transition>

    <!-- Queue status -->
    <div v-if="popupStore.queue.length > 0" class="mt-4 bg-sys-raised rounded-2xl p-4 border border-sys-border">
      <p class="text-sm text-textSecondary mb-2">
        排隊中 ({{ popupStore.queue.length }})
      </p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="t in popupStore.queue"
          :key="t.key"
          class="text-xs bg-sys-card border border-sys-border rounded px-2 py-1 text-textMuted"
        >
          {{ t.name }} (P:{{ t.priority }})
        </div>
      </div>
    </div>

    <!-- Rules reference -->
    <div class="mt-8 bg-sys-raised rounded-2xl p-5 border border-sys-border">
      <p class="text-sm font-semibold text-textBase mb-3">
        規則說明
      </p>
      <ul class="text-xs text-textSecondary space-y-1">
        <li>• <strong class="text-primary">輪盤 (P:100)</strong> — once_weekly，每週一次（週一 reset）</li>
        <li>• <strong class="text-secondary">Cyber (P:70)</strong> — once_per_login，每次登入一次（guest 無限）</li>
        <li>• <strong>遊戲 (P:60)</strong> — unlimited，無限次</li>
        <li>• <strong>公告 (P:50)</strong> — unlimited，無限次</li>
        <li>• <strong>圖片 (P:40)</strong> — once_daily，每日一次</li>
        <li>• <strong>消散 (P:30)</strong> — unlimited，無限次</li>
        <li>• <strong>表單 (P:1)</strong> — unlimited，最低優先</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

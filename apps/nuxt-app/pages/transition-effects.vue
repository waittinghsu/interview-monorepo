<script setup lang="ts">
import type { TransitionParams } from '~/components/transition-vfx/type'
import TransitionVfx from '~/components/transition-vfx/transition-vfx.vue'

definePageMeta({
  layout: 'default',
  title: 'Transition Effects Demo',
  ssr: false,
})

// 效果類型
type EffectType = 'shatter' | 'dissolve' | 'disintegrate' | 'turbulence'

// 可選特效列表
const effectOptions = [
  { value: 'shatter', label: 'Shatter（破碎）', icon: 'i-mdi-glass-fragile' },
  { value: 'dissolve', label: 'Dissolve（溶解）', icon: 'i-mdi-water' },
  { value: 'disintegrate', label: 'Disintegrate（瓦解）', icon: 'i-mdi-weather-dust' },
  { value: 'turbulence', label: 'Turbulence（湍流）', icon: 'i-mdi-weather-tornado' },
] as const

// 控制
const selectedEffect = ref<EffectType>('shatter')
const isAnimating = ref(false)
const showBlock = ref(true)

// 測試區塊的內容
const demoBlock = {
  title: '粒子效果測試',
  subtitle: '這是一個測試區塊',
  description: '使用下方控制面板來測試不同的粒子特效',
  items: [
    '⚡ transition-vfx 粒子系統',
    '🌌 基於 snapdom + animejs',
    '💫 完整的 enter/leave 動畫',
    '🎨 四種特效可選',
  ],
}

// 構建 transition params
const transitionParams = computed<TransitionParams>(() => ({
  name: selectedEffect.value,
}))

// Toggle 顯示/隱藏
function toggleVisibility() {
  if (isAnimating.value)
    return

  showBlock.value = !showBlock.value
}

// 動畫事件
function onEnter() {
  isAnimating.value = true
  console.log('Enter animation started:', selectedEffect.value)
}

function onAfterEnter() {
  isAnimating.value = false
  console.log('Enter animation completed')
}

function onLeave() {
  isAnimating.value = true
  console.log('Leave animation started:', selectedEffect.value)
}

function onAfterLeave() {
  isAnimating.value = false
  console.log('Leave animation completed')
}

// 重置
function reset() {
  if (isAnimating.value)
    return

  showBlock.value = false
  isAnimating.value = false

  nextTick(() => {
    selectedEffect.value = 'shatter'
    showBlock.value = true
  })
}
</script>

<template>
  <div class="min-h-screen bg-sys-page p-8">
    <div class="mx-auto max-w-4xl">
      <!-- 標題 -->
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-4xl font-bold text-textBase">
          ✨ Transition Effects
        </h1>
        <p class="text-textSecondary">
          測試 transition-vfx 視覺過渡特效
        </p>
      </div>

      <!-- 控制面板 -->
      <div class="mb-8 rounded-2xl bg-sys-card p-6">
        <h2 class="mb-4 text-xl font-bold text-textBase">
          控制面板
        </h2>

        <div class="space-y-6">
          <!-- 特效選擇 -->
          <div class="flex items-center gap-4">
            <label class="min-w-24 text-sm font-medium text-textBase">
              選擇特效：
            </label>
            <q-select
              v-model="selectedEffect"
              :options="effectOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              outlined
              dense
              class="flex-1 max-w-xs"
              :disable="isAnimating"
            >
              <template #prepend>
                <i :class="effectOptions.find(e => e.value === selectedEffect)?.icon" />
              </template>
            </q-select>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-wrap items-center gap-4">
            <label class="min-w-24 text-sm font-medium text-textBase">
              操作：
            </label>

            <!-- Toggle 按鈕 -->
            <q-btn
              unelevated
              :disable="isAnimating"
              :class="showBlock ? 'btn-gradient-error' : 'btn-gradient-success'"
              @click="toggleVisibility"
            >
              <i :class="showBlock ? 'i-mdi-eye-off mr-2' : 'i-mdi-eye mr-2'" />
              {{ showBlock ? '隱藏（Leave）' : '顯示（Enter）' }}
            </q-btn>

            <!-- 重置按鈕 -->
            <q-btn
              outline
              :disable="isAnimating"
              class="border-sys-border text-textSecondary"
              @click="reset"
            >
              <i class="i-mdi-refresh mr-2" />
              重置
            </q-btn>
          </div>

          <!-- 狀態指示 -->
          <div class="flex items-center gap-4 rounded-lg bg-sys-raised p-4">
            <div class="flex items-center gap-2">
              <div
                class="h-3 w-3 rounded-full transition-colors"
                :class="isAnimating ? 'animate-pulse bg-primary' : 'bg-sys-border'"
              />
              <span class="text-sm text-textSecondary">
                {{ isAnimating ? '動畫進行中...' : '就緒' }}
              </span>
            </div>
            <div class="h-4 w-px bg-sys-border" />
            <div class="flex items-center gap-2">
              <i class="i-mdi-palette text-primary" />
              <span class="text-sm text-textBase">
                當前特效: <strong class="text-primary">{{ selectedEffect }}</strong>
              </span>
            </div>
            <div class="h-4 w-px bg-sys-border" />
            <div class="flex items-center gap-2">
              <i :class="showBlock ? 'i-mdi-eye text-success' : 'i-mdi-eye-off text-textMuted'" />
              <span class="text-sm text-textBase">
                狀態: <strong :class="showBlock ? 'text-success' : 'text-textMuted'">
                  {{ showBlock ? '顯示' : '隱藏' }}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 測試區塊 -->
      <div class="flex min-h-[400px] items-center justify-center">
        <TransitionVfx
          :duration="2000"
          :enter-params="transitionParams"
          :leave-params="transitionParams"
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @leave="onLeave"
          @after-leave="onAfterLeave"
        >
          <q-card v-if="showBlock" class="w-full max-w-2xl bg-sys-card shadow-2xl">
            <q-card-section class="p-8">
              <!-- Icon -->
              <div class="mb-6 flex justify-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <i class="i-mdi-star-four-points text-4xl text-primary" />
                </div>
              </div>

              <!-- 標題 -->
              <h2 class="mb-2 text-center text-3xl font-bold text-textBase">
                {{ demoBlock.title }}
              </h2>
              <p class="mb-6 text-center text-lg text-primary">
                {{ demoBlock.subtitle }}
              </p>

              <!-- 描述 -->
              <p class="mb-6 text-center text-textSecondary">
                {{ demoBlock.description }}
              </p>

              <!-- 特點列表 -->
              <div class="space-y-3">
                <div
                  v-for="(item, index) in demoBlock.items"
                  :key="index"
                  class="flex items-center gap-3 rounded-lg bg-white/5 p-3"
                >
                  <i class="i-mdi-check-circle text-xl text-primary" />
                  <span class="text-textSecondary">{{ item }}</span>
                </div>
              </div>

              <!-- 裝飾元素 -->
              <div class="mt-6 flex justify-center gap-2">
                <div class="h-1 w-1 rounded-full bg-primary" />
                <div class="h-1 w-1 rounded-full bg-secondary" />
                <div class="h-1 w-1 rounded-full bg-primary" />
              </div>
            </q-card-section>
          </q-card>
        </TransitionVfx>
      </div>

      <!-- 說明 -->
      <div class="mt-8 rounded-xl bg-sys-card/50 p-6">
        <h3 class="mb-3 text-lg font-bold text-textBase">
          💡 使用說明
        </h3>
        <div class="space-y-4">
          <div>
            <h4 class="mb-2 font-semibold text-textBase">
              操作流程：
            </h4>
            <ol class="space-y-2 text-sm text-textSecondary pl-4">
              <li>1️⃣ <strong class="text-primary">選擇特效</strong>：從下拉選單選擇想要測試的粒子效果</li>
              <li>2️⃣ <strong class="text-success">切換顯示</strong>：點擊「顯示 (Enter)」或「隱藏 (Leave)」按鈕觸發動畫</li>
              <li>3️⃣ <strong class="text-warning">觀察效果</strong>：留意粒子如何聚合（enter）或飛散（leave）</li>
              <li>4️⃣ <strong class="text-textMuted">重置狀態</strong>：隨時點擊「重置」回到初始狀態</li>
            </ol>
          </div>

          <div>
            <h4 class="mb-2 font-semibold text-textBase">
              可用特效：
            </h4>
            <ul class="space-y-1 text-sm text-textSecondary pl-4">
              <li>• <strong class="text-primary">Shatter</strong>：三角形碎片向外飛散/聚合</li>
              <li>• <strong class="text-success">Dissolve</strong>：像素逐漸消失/浮現</li>
              <li>• <strong class="text-secondary">Disintegrate</strong>：粒子化崩解/重組</li>
              <li>• <strong class="text-warning">Turbulence</strong>：扭曲變形效果</li>
            </ul>
          </div>

          <div class="text-xs text-textMuted pt-2 border-t border-sys-border">
            技術：transition-vfx (snapdom + animejs-v4) | 動畫時長：2 秒
          </div>
        </div>
      </div>

      <!-- 返回連結 -->
      <div class="mt-6 text-center">
        <NuxtLink
          to="/resume"
          class="text-primary hover:text-secondary transition-colors"
        >
          ← 返回 Resume 頁面
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 動畫 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

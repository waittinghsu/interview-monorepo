<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Cyber Components',
})

const crosshairLocked = ref(false)
const gaugeValue = ref(65)
const pulseRings = ref(5)

const accentColors = ['#22d3ee', '#f97316', '#a78bfa', '#34d399', '#f43f5e']
const selectedColor = ref('#22d3ee')
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 space-y-10">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-textBase mb-2">
        Cyber Components
      </h1>
      <p class="text-textMuted">
        Cyberpunk 風格動畫元件展示
      </p>
    </div>

    <!-- CyberCrosshair -->
    <section class="card-base p-6">
      <h2 class="text-lg font-bold text-textBrand mb-6 flex items-center gap-2">
        <div class="i-mdi-crosshairs-gps" />
        CyberCrosshair 瞄準鏡
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-8">
        <ClientOnly>
          <CyberCrosshair :size="200" :locked="crosshairLocked" />
        </ClientOnly>
        <div class="space-y-4 flex-1">
          <div>
            <p class="text-textSecondary text-sm mb-2">
              鎖定狀態
            </p>
            <q-toggle
              v-model="crosshairLocked"
              :label="crosshairLocked ? 'LOCKED' : 'SCANNING'"
              color="primary"
            />
          </div>
          <ul class="text-textMuted text-sm space-y-1 list-none">
            <li>• 外圈 4 段弧形持續旋轉</li>
            <li>• 鎖定時括弧向內縮緊</li>
            <li>• 中心點持續閃爍</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CyberGauge -->
    <section class="card-base p-6">
      <h2 class="text-lg font-bold text-textBrand mb-6 flex items-center gap-2">
        <div class="i-mdi-gauge" />
        CyberGauge 儀表板
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="flex gap-6 items-end">
          <ClientOnly>
            <CyberGauge :size="180" :value="gaugeValue" :color="selectedColor" label="POWER" />
            <CyberGauge :size="120" :value="100 - gaugeValue" color="#f97316" label="HEAT" />
          </ClientOnly>
        </div>
        <div class="space-y-4 flex-1">
          <div>
            <p class="text-textSecondary text-sm mb-2">
              數值 {{ gaugeValue }}%
            </p>
            <q-slider v-model="gaugeValue" :min="0" :max="100" color="primary" />
          </div>
          <div>
            <p class="text-textSecondary text-sm mb-2">
              顏色
            </p>
            <div class="flex gap-2">
              <button
                v-for="c in accentColors"
                :key="c"
                type="button"
                class="w-6 h-6 rounded-full border-2 transition-transform cursor-pointer"
                :style="{ background: c, borderColor: selectedColor === c ? 'white' : 'transparent' }"
                :class="{ 'scale-125': selectedColor === c }"
                @click="selectedColor = c"
              />
            </div>
          </div>
          <ul class="text-textMuted text-sm space-y-1 list-none">
            <li>• 270° 弧形進度（儀表盤風格）</li>
            <li>• 數值變化平滑動畫過渡</li>
            <li>• 28 個刻度線均勻分佈</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CyberPulse -->
    <section class="card-base p-6">
      <h2 class="text-lg font-bold text-textBrand mb-6 flex items-center gap-2">
        <div class="i-mdi-pulse" />
        CyberPulse 同心圓脈衝
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="flex gap-4 items-center">
          <ClientOnly>
            <CyberPulse :size="180" :rings="pulseRings" />
            <CyberPulse :size="110" :rings="5" color="#a78bfa" />
            <CyberPulse :size="70" :rings="2" color="#34d399" />
          </ClientOnly>
        </div>
        <div class="space-y-4 flex-1">
          <div>
            <p class="text-textSecondary text-sm mb-2">
              脈衝環數 {{ pulseRings }}
            </p>
            <q-slider v-model="pulseRings" :min="1" :max="10" :step="1" color="primary" />
          </div>
          <ul class="text-textMuted text-sm space-y-1 list-none">
            <li>• 同心圓從中心向外擴散</li>
            <li>• 錯位時序動畫</li>
            <li>• 可作為 loading 或狀態指示</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Combined HUD -->
    <section class="card-base p-6">
      <h2 class="text-lg font-bold text-textBrand mb-6">
        組合 HUD 展示
      </h2>
      <div class="flex justify-center items-center gap-6 flex-wrap">
        <ClientOnly>
          <CyberPulse :size="90" :rings="2" color="#f43f5e" />
          <CyberCrosshair :size="160" :locked="crosshairLocked" />
          <CyberGauge :size="150" :value="gaugeValue" :color="selectedColor" label="SYS" />
          <CyberGauge :size="110" :value="100 - gaugeValue" color="#f97316" label="TEMP" />
          <CyberPulse :size="90" :rings="3" color="#a78bfa" />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

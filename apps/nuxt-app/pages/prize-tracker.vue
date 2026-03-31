<script setup lang="ts">
import type { DrawEvent, PrizeState } from '~/features/prize-tracker'
import {
  BubbleController,
  Chart,
  Legend,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js'
import { useDrawEventsQuery, usePrizeStateQuery } from '~/features/prize-tracker'
import 'chartjs-adapter-date-fns'

definePageMeta({ layout: 'default', title: 'TWICE 抽獎追蹤' })

Chart.register(BubbleController, PointElement, LinearScale, TimeScale, Tooltip, Legend)

// ── 品項設定 ──────────────────────────────────────────────────
const ITEMS = [
  { code: 'A-1', name: '終演後お見送り会', color: '#00f5ff' },
  { code: 'A-2', name: '直筆サイン入り ユニットポラ', color: '#ff00aa' },
  { code: 'B', name: '直筆サイン入り ソロポラ', color: '#ffe600' },
  { code: 'C', name: '直筆サイン入り OFFICIAL GOODS', color: '#00ff88' },
] as const

// ── Queries ───────────────────────────────────────────────────
const { data: stateData, isFetching: stateFetching, refetch: refetchState } = usePrizeStateQuery()
const { data: drawsData, isFetching: drawsFetching, refetch: refetchDraws } = useDrawEventsQuery()

const isLoading = computed(() => stateFetching.value || drawsFetching.value)
const lastUpdated = ref<Date | null>(null)

async function refresh() {
  await Promise.all([refetchState(), refetchDraws()])
  lastUpdated.value = new Date()
}

watch([stateData, drawsData], ([s, d]) => {
  if (s && d)
    lastUpdated.value = new Date()
}, { immediate: true })

// ── 倒數計時 ─────────────────────────────────────────────────
const countdown = ref(60)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 60
  countdownTimer && clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0)
      countdown.value = 60
  }, 1000)
}

onMounted(() => startCountdown())
onUnmounted(() => countdownTimer && clearInterval(countdownTimer))

// ── Card 計算 ─────────────────────────────────────────────────
function getState(name: string): PrizeState | undefined {
  return stateData.value?.find(s => s.name === name)
}

function getPct(state: PrizeState | undefined): number {
  if (!state || !state.total)
    return 0
  return Math.round((state.remaining / state.total) * 100)
}

// ── 格式化 ────────────────────────────────────────────────────
function formatJST(date: Date): string {
  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(ms: number): string {
  if (ms <= 0)
    return '—'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0)
    return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0)
    return `${m}m ${String(sec).padStart(2, '0')}s`
  return `${sec}s`
}

// ── Draw table per item ───────────────────────────────────────
function getItemDraws(name: string): DrawEvent[] {
  return [...(drawsData.value?.filter(d => d.name === name) ?? [])].reverse()
}

// ── Charts ───────────────────────────────────────────────────
const timelineCanvasRef = ref<HTMLCanvasElement | null>(null)
const hourCanvasRef = ref<HTMLCanvasElement | null>(null)
let timelineChart: Chart | null = null
let hourChart: Chart | null = null

const GRID_COLOR = 'rgba(26,26,62,0.8)'
const TICK_COLOR = '#4a5280'
const TICK_FONT = { family: 'Courier New', size: 10 } as const

function buildTimelineChart(canvas: HTMLCanvasElement) {
  timelineChart = new Chart(canvas, {
    type: 'bubble',
    data: {
      datasets: ITEMS.map(item => ({
        label: item.code,
        data: [],
        backgroundColor: `${item.color}99`,
        borderColor: item.color,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { hour: 'MM/dd HH:mm', day: 'MM/dd' } },
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR, font: TICK_FONT },
        },
        y: {
          min: -0.5,
          max: 3.5,
          grid: { color: GRID_COLOR },
          ticks: {
            color: TICK_COLOR,
            font: TICK_FONT,
            stepSize: 1,
            callback: (val: string | number) => ITEMS[Number(val)]?.code ?? '',
          },
        },
      },
      plugins: {
        legend: { labels: { color: TICK_COLOR, font: TICK_FONT, boxWidth: 10 } },
        tooltip: {
          backgroundColor: '#0f0f1a',
          borderColor: '#1a1a3e',
          borderWidth: 1,
          titleColor: '#c0c8e0',
          bodyColor: '#8090b0',
          callbacks: {
            title: (items) => {
              const d = items[0].raw as { x: number }
              return formatJST(new Date(d.x))
            },
            label: (item) => {
              const d = item.raw as DrawEvent & { x: number, y: number, r: number }
              return [` ${d.name}`, ` 抽出：${d.drawnCount} 個`, ` 剩餘：${d.beforeRemaining} → ${d.afterRemaining}`]
            },
          },
        },
      },
    },
  })
}

function buildHourChart(canvas: HTMLCanvasElement) {
  hourChart = new Chart(canvas, {
    type: 'bubble',
    data: {
      datasets: ITEMS.map(item => ({
        label: item.code,
        data: [],
        backgroundColor: `${item.color}99`,
        borderColor: item.color,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        x: {
          min: -1,
          max: 24,
          grid: { color: GRID_COLOR },
          ticks: {
            color: TICK_COLOR,
            font: TICK_FONT,
            stepSize: 3,
            callback: (v: string | number) => (Number(v) >= 0 && Number(v) <= 23) ? `${String(v).padStart(2, '0')}:00` : '',
          },
        },
        y: {
          type: 'time',
          min: '2026-03-27',
          time: { unit: 'day', displayFormats: { day: 'MM/dd' } },
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR, font: TICK_FONT },
        },
      },
      plugins: {
        legend: { labels: { color: TICK_COLOR, font: TICK_FONT, boxWidth: 10 } },
        tooltip: {
          backgroundColor: '#0f0f1a',
          borderColor: '#1a1a3e',
          borderWidth: 1,
          titleColor: '#c0c8e0',
          bodyColor: '#8090b0',
          callbacks: {
            title: (items) => {
              const d = items[0].raw as DrawEvent & { x: number }
              const twn = new Date(new Date(d.detectedAt).getTime() + 8 * 3600 * 1000)
              const hh = String(twn.getUTCHours()).padStart(2, '0')
              const mm = String(twn.getUTCMinutes()).padStart(2, '0')
              return `${hh}:${mm} 台灣`
            },
            label: (item) => {
              const d = item.raw as DrawEvent
              return [` ${d.name}`, ` 抽出：${d.drawnCount} 個`, ` 剩餘：${d.beforeRemaining} → ${d.afterRemaining}`]
            },
          },
        },
      },
    },
  })
}

function updateCharts(draws: DrawEvent[]) {
  if (timelineChart) {
    ITEMS.forEach((item, i) => {
      timelineChart!.data.datasets[i].data = draws
        .filter(d => d.name === item.name)
        .map(d => ({ x: new Date(d.detectedAt).getTime(), y: i, r: Math.max(5, d.drawnCount * 7), ...d }))
    })
    timelineChart.update()
  }

  if (hourChart) {
    ITEMS.forEach((item, i) => {
      hourChart!.data.datasets[i].data = draws
        .filter(d => d.name === item.name)
        .map((d) => {
          const twn = new Date(new Date(d.detectedAt).getTime() + 8 * 3600 * 1000)
          const midnightUTC = new Date(Date.UTC(twn.getUTCFullYear(), twn.getUTCMonth(), twn.getUTCDate()) - 8 * 3600 * 1000)
          return { x: twn.getUTCHours(), y: midnightUTC.getTime(), r: Math.max(5, d.drawnCount * 7), ...d }
        })
    })
    hourChart.update()
  }
}

// 初始化 chart（ClientOnly 後 canvas 才存在）
function initCharts() {
  if (timelineCanvasRef.value && !timelineChart)
    buildTimelineChart(timelineCanvasRef.value)
  if (hourCanvasRef.value && !hourChart)
    buildHourChart(hourCanvasRef.value)
}

watch(drawsData, (draws) => {
  if (draws)
    updateCharts(draws)
})
</script>

<template>
  <div class="p-4 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-sys-border">
      <div>
        <h1 class="text-xl font-mono tracking-widest text-[#00f5ff] uppercase" style="text-shadow: 0 0 8px #00f5ff88">
          TWICE 抽獎追蹤
        </h1>
        <p class="text-xs text-textMuted font-mono tracking-wider mt-1">
          CHANCE.FANPLA.JP/TWICE/471 &nbsp;|&nbsp; 2026/03/27 – 04/28 &nbsp;|&nbsp; AUTO MONITOR
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <q-btn
          unelevated dense
          class="font-mono text-xs border border-[#00f5ff] text-[#00f5ff] px-3"
          :loading="isLoading"
          @click="refresh"
        >
          ⟳ REFRESH
        </q-btn>
      </div>
    </div>

    <!-- Prize Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div
        v-for="item in ITEMS"
        :key="item.code"
        class="bg-sys-card border border-sys-border p-4 relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 right-0 h-0.5" :style="{ background: item.color }" />
        <div class="text-xs font-mono tracking-widest text-textMuted mb-1">
          {{ item.code }}
        </div>
        <div class="text-xs text-textMuted font-mono leading-tight mb-3">
          {{ item.name }}
        </div>
        <div class="text-3xl font-bold font-mono leading-none" :style="{ color: item.color, textShadow: `0 0 8px ${item.color}88` }">
          {{ getState(item.name)?.remaining ?? '--' }}
        </div>
        <div class="text-sm text-textMuted font-mono mt-1">
          / {{ getState(item.name)?.total ?? '--' }}
          <span class="ml-2 text-xs">
            {{ getState(item.name) ? `(${getPct(getState(item.name))}% 剩餘)` : '' }}
          </span>
        </div>
        <div class="mt-3 h-0.5 bg-sys-border rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: `${getPct(getState(item.name))}%`, background: item.color }"
          />
        </div>
      </div>
    </div>

    <!-- Timeline Chart -->
    <ClientOnly @ready="initCharts">
      <div class="bg-sys-card border border-sys-border p-5 mb-5">
        <div class="text-xs font-mono tracking-widest text-textMuted uppercase mb-4">
          ▸ DRAW TIMELINE &nbsp; X=時間 &nbsp; Y=品項 &nbsp; 點大小=抽出數量
        </div>
        <div class="relative h-64">
          <canvas ref="timelineCanvasRef" />
        </div>
      </div>

      <!-- Hour Analysis Chart -->
      <div class="bg-sys-card border border-sys-border p-5 mb-5">
        <div class="text-xs font-mono tracking-widest text-textMuted uppercase mb-4">
          ⏰ 開獎時段分析 &nbsp; X=時刻(台灣) &nbsp; Y=日期 &nbsp; 點大小=抽出數量
        </div>
        <div class="relative h-64">
          <canvas ref="hourCanvasRef" />
        </div>
      </div>
    </ClientOnly>

    <!-- Draw Tables -->
    <div class="text-xs font-mono tracking-widest text-textMuted uppercase mb-4">
      ▸ 各品項抽取紀錄
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div
        v-for="item in ITEMS"
        :key="item.code"
        class="bg-sys-card border border-sys-border overflow-hidden"
      >
        <div
          class="flex justify-between items-center px-3 py-2 border-b border-sys-border text-xs font-mono font-bold"
          :style="{ color: item.color }"
        >
          <span>{{ item.code }}</span>
          <span class="text-textMuted font-normal">{{ getItemDraws(item.name).length }} 筆</span>
        </div>

        <div v-if="getItemDraws(item.name).length === 0" class="p-4 text-center text-xs text-textMuted font-mono">
          — 尚無紀錄 —
        </div>
        <table v-else class="w-full text-xs font-mono">
          <thead>
            <tr>
              <th class="px-2 py-1.5 text-left text-textMuted font-normal border-b border-sys-border">
                時間(台灣)
              </th>
              <th class="px-2 py-1.5 text-left text-textMuted font-normal border-b border-sys-border">
                抽出
              </th>
              <th class="px-2 py-1.5 text-left text-textMuted font-normal border-b border-sys-border">
                剩餘
              </th>
              <th class="px-2 py-1.5 text-left text-textMuted font-normal border-b border-sys-border">
                間隔
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(draw, i) in getItemDraws(item.name)"
              :key="draw.detectedAt"
              class="hover:bg-sys-raised transition-colors"
            >
              <td class="px-2 py-1 border-b border-sys-border/40 text-textSecondary">
                {{ formatJST(new Date(draw.detectedAt)) }}
              </td>
              <td class="px-2 py-1 border-b border-sys-border/40 font-bold" :style="{ color: item.color }">
                -{{ draw.drawnCount }}
              </td>
              <td class="px-2 py-1 border-b border-sys-border/40 text-textSecondary">
                {{ draw.beforeRemaining }}→{{ draw.afterRemaining }}
              </td>
              <td class="px-2 py-1 border-b border-sys-border/40 text-textMuted">
                {{ i < getItemDraws(item.name).length - 1 ? formatDuration(new Date(draw.detectedAt).getTime() - new Date(getItemDraws(item.name)[i + 1].detectedAt).getTime()) : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-sys-border text-xs font-mono text-textMuted">
      <div class="flex items-center gap-2">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" style="box-shadow: 0 0 6px #00ff88" />
        <span>{{ lastUpdated ? `更新：${formatJST(lastUpdated)}` : '載入中...' }}</span>
      </div>
      <div class="text-[#00f5ff]">
        下次更新：{{ String(Math.floor(countdown / 60)).padStart(2, '0') }}:{{ String(countdown % 60).padStart(2, '0') }}
      </div>
    </div>
  </div>
</template>

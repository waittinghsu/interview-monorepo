<script setup lang="ts">
import type { StockParams } from '~/features/stock'
import { CandlestickSeries, createChart, LineSeries } from 'lightweight-charts'
import { use0050Query, useBTCQuery } from '~/features/stock'

definePageMeta({
  layout: 'default',
})

const candlestickChartContainer = shallowRef<HTMLDivElement | null>(null)
const lineChartContainer = shallowRef<HTMLDivElement | null>(null)
let candlestickChart: ReturnType<typeof createChart> | null = null
let lineChart: ReturnType<typeof createChart> | null = null

// 區間選項
type RangeValue = NonNullable<StockParams['range']>

const ranges: Array<{ value: RangeValue, label: string }> = [
  { value: '1d', label: '1日' },
  { value: '5d', label: '5日' },
  { value: '1mo', label: '1月' },
  { value: '3mo', label: '3月' },
  { value: '6mo', label: '6月' },
  { value: '1y', label: '1年' },
  { value: '2y', label: '2年' },
  { value: '5y', label: '5年' },
  { value: 'max', label: '全部' },
]

// 各區間對應的最適 interval
const rangeIntervalMap: Record<RangeValue, NonNullable<StockParams['interval']>> = {
  '1d': '5m',
  '5d': '15m',
  '1mo': '1d',
  '3mo': '1d',
  '6mo': '1d',
  '1y': '1d',
  '2y': '1wk',
  '5y': '1wk',
  '10y': '1wk',
  'ytd': '1d',
  'max': '1mo',
}

const selectedRange = ref<RangeValue>('1mo')

// 單一 reactive query，切換區間時自動重新請求
const queryParams = computed<StockParams>(() => ({
  range: selectedRange.value,
  interval: rangeIntervalMap[selectedRange.value],
}))

const { data: stockData, isLoading: stockLoading, error: stockError } = use0050Query(queryParams)
const { data: btcData, isLoading: btcLoading, error: btcError } = useBTCQuery()

// 圖表選項
const chartOptions = {
  layout: {
    background: { color: 'transparent' },
    textColor: '#AAC0D2',
  },
  grid: {
    vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
    horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
  },
  crosshair: {
    mode: 0,
  },
  timeScale: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
}

// 資料或 container 變更時重建圖表（切換區間也會觸發）
watch([stockData, candlestickChartContainer], ([data, container]) => {
  if (!container)
    return
  if (candlestickChart) {
    candlestickChart.remove()
    candlestickChart = null
  }
  if (!data || data.length === 0)
    return

  candlestickChart = createChart(container, {
    ...chartOptions,
    width: container.clientWidth,
    height: 400,
  })

  const series = candlestickChart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  })

  series.setData(data)
  candlestickChart.timeScale().fitContent()
}, { immediate: true })

watch([btcData, lineChartContainer], ([data, container]) => {
  if (!container)
    return
  if (lineChart) {
    lineChart.remove()
    lineChart = null
  }
  if (!data || data.length === 0)
    return

  lineChart = createChart(container, {
    ...chartOptions,
    width: container.clientWidth,
    height: 400,
  })

  const lineSeries = lineChart.addSeries(LineSeries, {
    color: '#f7931a',
    lineWidth: 2,
  })

  lineSeries.setData(data)
  lineChart.timeScale().fitContent()
}, { immediate: true })

function handleResize() {
  if (candlestickChart && candlestickChartContainer.value)
    candlestickChart.applyOptions({ width: candlestickChartContainer.value.clientWidth })

  if (lineChart && lineChartContainer.value)
    lineChart.applyOptions({ width: lineChartContainer.value.clientWidth })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  candlestickChart?.remove()
  lineChart?.remove()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-textBase">
      股票圖表展示
    </h1>

    <!-- 0050 圖表 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 class="text-xl font-semibold text-textBase">
            0050 元大台灣50
          </h2>
          <p class="text-textSecondary text-sm mt-1">
            TanStack Query 管理 · {{ queryParams.interval }} / {{ queryParams.range }}
          </p>
        </div>

        <!-- 區間按鈕 -->
        <div class="flex flex-wrap gap-1">
          <q-btn
            v-for="r in ranges"
            :key="r.value"
            :unelevated="selectedRange === r.value"
            :outline="selectedRange !== r.value"
            color="primary"
            :label="r.label"
            size="sm"
            @click="selectedRange = r.value"
          />
        </div>
      </div>

      <ClientOnly>
        <div v-if="stockLoading" class="bg-sys-card rounded-lg p-8 mb-4 text-center">
          <p class="text-textSecondary">
            載入中...
          </p>
        </div>

        <div v-else-if="stockError" class="bg-sys-card rounded-lg p-4 mb-4">
          <p class="text-red-500">
            無法載入 0050 資料
          </p>
        </div>

        <div v-else class="bg-sys-card rounded-lg p-4 mb-2">
          <div ref="candlestickChartContainer" class="w-full" />
        </div>

        <div v-if="!stockLoading && !stockError && stockData" class="text-textMuted text-sm">
          <p>顯示資料筆數：{{ stockData.length }} 筆</p>
        </div>

        <template #fallback>
          <div class="bg-sys-card rounded-lg p-8 mb-4 text-center">
            <p class="text-textSecondary">
              準備載入圖表...
            </p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- BTC 折線圖 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2 text-textBase">
        Bitcoin (BTC-USD) 折線圖
      </h2>
      <p class="text-textSecondary mb-4 text-sm">
        最近一個月資料 · TanStack Query 管理
      </p>

      <ClientOnly>
        <div v-if="btcLoading" class="bg-sys-card rounded-lg p-8 mb-4 text-center">
          <p class="text-textSecondary">
            載入中...
          </p>
        </div>

        <div v-else-if="btcError" class="bg-sys-card rounded-lg p-4 mb-4">
          <p class="text-red-500">
            無法載入 BTC 資料
          </p>
        </div>

        <div v-else class="bg-sys-card rounded-lg p-4 mb-2">
          <div ref="lineChartContainer" class="w-full" />
        </div>

        <div v-if="!btcLoading && !btcError && btcData" class="text-textMuted text-sm">
          <p>顯示資料筆數：{{ btcData.length }} 筆</p>
        </div>

        <template #fallback>
          <div class="bg-sys-card rounded-lg p-8 mb-4 text-center">
            <p class="text-textSecondary">
              準備載入圖表...
            </p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <NuxtLink to="/" class="inline-block text-textSecondary hover:text-primary">
      ← 返回首頁
    </NuxtLink>
  </div>
</template>

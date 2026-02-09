<script setup lang="ts">
import { CandlestickSeries, createChart, LineSeries } from 'lightweight-charts'
import { use0050Query, useBTCQuery } from '~/composables/api/useStock'

definePageMeta({
  layout: 'default',
})

const candlestickChartContainer = ref<HTMLDivElement | null>(null)
const lineChartContainer = ref<HTMLDivElement | null>(null)
let candlestickChart: ReturnType<typeof createChart> | null = null
let lineChart: ReturnType<typeof createChart> | null = null

// 使用 TanStack Query
const { data: stockData, isLoading: stockLoading, error: stockError } = use0050Query()
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

// 監聽資料變化建立圖表
watch([stockData, candlestickChartContainer], ([data, container]) => {
  if (data && container && data.length > 0 && !candlestickChart) {
    candlestickChart = createChart(container, {
      ...chartOptions,
      width: container.clientWidth,
      height: 400,
    })

    const candlestickSeries = candlestickChart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeries.setData(data)
    candlestickChart.timeScale().fitContent()
  }
}, { immediate: true })

watch([btcData, lineChartContainer], ([data, container]) => {
  if (data && container && data.length > 0 && !lineChart) {
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
  }
}, { immediate: true })

function handleResize() {
  if (candlestickChart && candlestickChartContainer.value) {
    candlestickChart.applyOptions({ width: candlestickChartContainer.value.clientWidth })
  }
  if (lineChart && lineChartContainer.value) {
    lineChart.applyOptions({ width: lineChartContainer.value.clientWidth })
  }
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
    <h1 class="text-2xl font-bold mb-6 text-textPrimary">
      股票圖表展示
    </h1>

    <!-- 0050 K線圖 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2 text-textPrimary">
        0050 元大台灣50 (K線圖)
      </h2>
      <p class="text-textSecondary mb-4 text-sm">
        最近一個月資料 - TanStack Query 管理
      </p>

      <div v-if="stockLoading" class="bg-sys-surface rounded-lg p-8 mb-4 text-center">
        <p class="text-textSecondary">
          載入中...
        </p>
      </div>

      <div v-else-if="stockError" class="bg-sys-surface rounded-lg p-4 mb-4">
        <p class="text-red-500">
          無法載入 0050 資料
        </p>
      </div>

      <div v-else class="bg-sys-surface rounded-lg p-4 mb-2">
        <div ref="candlestickChartContainer" class="w-full" />
      </div>

      <div v-if="!stockLoading && !stockError && stockData" class="text-textMuted text-sm">
        <p>顯示資料筆數：{{ stockData.length }} 筆</p>
      </div>
    </div>

    <!-- BTC 折線圖 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2 text-textPrimary">
        Bitcoin (BTC-USD) 折線圖
      </h2>
      <p class="text-textSecondary mb-4 text-sm">
        最近一個月資料 - TanStack Query 管理
      </p>

      <div v-if="btcLoading" class="bg-sys-surface rounded-lg p-8 mb-4 text-center">
        <p class="text-textSecondary">
          載入中...
        </p>
      </div>

      <div v-else-if="btcError" class="bg-sys-surface rounded-lg p-4 mb-4">
        <p class="text-red-500">
          無法載入 BTC 資料
        </p>
      </div>

      <div v-else class="bg-sys-surface rounded-lg p-4 mb-2">
        <div ref="lineChartContainer" class="w-full" />
      </div>

      <div v-if="!btcLoading && !btcError && btcData" class="text-textMuted text-sm">
        <p>顯示資料筆數：{{ btcData.length }} 筆</p>
      </div>
    </div>

    <NuxtLink to="/" class="inline-block text-textSecondary hover:text-primary">
      ← 返回首頁
    </NuxtLink>
  </div>
</template>

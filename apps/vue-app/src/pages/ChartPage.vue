<script setup>
import { CandlestickSeries, createChart, LineSeries } from 'lightweight-charts'
import { stockApi } from '@/api'

const candlestickChartContainer = ref(null)
const lineChartContainer = ref(null)
let candlestickChart = null
let lineChart = null
const stockData = ref([])
const btcData = ref([])
const loading = ref(true)
const btcLoading = ref(true)
const error = ref(null)
const btcError = ref(null)

// 獲取 0050 股票資料
async function fetchStockData() {
  try {
    loading.value = true
    error.value = null

    const response = await stockApi.get0050({ range: '1mo', interval: '1d' })

    const result = response.data.chart.result[0]
    const timestamps = result.timestamp
    const quotes = result.indicators.quote[0]

    // 轉換成 lightweight-charts 格式
    stockData.value = timestamps.map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      close: quotes.close[index],
    })).filter(item => item.open !== null)

    loading.value = false
  }
  catch (err) {
    console.error('獲取 0050 資料失敗:', err)
    error.value = '無法載入 0050 資料，請稍後再試'
    loading.value = false
  }
}

// 獲取比特幣資料
async function fetchBTCData() {
  try {
    btcLoading.value = true
    btcError.value = null

    const response = await stockApi.getBTC({ range: '1mo', interval: '1d' })

    const result = response.data.chart.result[0]
    const timestamps = result.timestamp
    const quotes = result.indicators.quote[0]

    // 轉換成折線圖格式（只需要 time 和 value）
    btcData.value = timestamps.map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString().split('T')[0],
      value: quotes.close[index],
    })).filter(item => item.value !== null)

    btcLoading.value = false
  }
  catch (err) {
    console.error('獲取 BTC 資料失敗:', err)
    btcError.value = '無法載入 BTC 資料，請稍後再試'
    btcLoading.value = false
  }
}

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
    mode: 0, // Normal
  },
  timeScale: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
}

onMounted(async () => {
  // 並行獲取兩個資料
  await Promise.all([fetchStockData(), fetchBTCData()])

  // 建立 0050 K線圖
  if (candlestickChartContainer.value && stockData.value.length > 0) {
    candlestickChart = createChart(candlestickChartContainer.value, {
      ...chartOptions,
      width: candlestickChartContainer.value.clientWidth,
      height: 400,
    })

    const candlestickSeries = candlestickChart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeries.setData(stockData.value)
    candlestickChart.timeScale().fitContent()
  }

  // 建立比特幣折線圖
  if (lineChartContainer.value && btcData.value.length > 0) {
    lineChart = createChart(lineChartContainer.value, {
      ...chartOptions,
      width: lineChartContainer.value.clientWidth,
      height: 400,
    })

    const lineSeries = lineChart.addSeries(LineSeries, {
      color: '#f7931a',
      lineWidth: 2,
    })

    lineSeries.setData(btcData.value)
    lineChart.timeScale().fitContent()
  }

  // 監聽視窗大小變化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  candlestickChart?.remove()
  lineChart?.remove()
})

function handleResize() {
  if (candlestickChart && candlestickChartContainer.value) {
    candlestickChart.applyOptions({ width: candlestickChartContainer.value.clientWidth })
  }
  if (lineChart && lineChartContainer.value) {
    lineChart.applyOptions({ width: lineChartContainer.value.clientWidth })
  }
}
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
        最近一個月資料 - 使用 YAPI Mock Server
      </p>

      <!-- 載入中 -->
      <div v-if="loading" class="bg-sys-surface rounded-lg p-8 mb-4 text-center">
        <p class="text-textSecondary">
          載入中...
        </p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="bg-sys-surface rounded-lg p-4 mb-4">
        <p class="text-red-500">
          {{ error }}
        </p>
      </div>

      <!-- K線圖容器 -->
      <div v-else class="bg-sys-surface rounded-lg p-4 mb-2">
        <div ref="candlestickChartContainer" class="w-full" />
      </div>

      <!-- 說明 -->
      <div v-if="!loading && !error" class="text-textMuted text-sm">
        <p>顯示資料筆數：{{ stockData.length }} 筆</p>
      </div>
    </div>

    <!-- 比特幣折線圖 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2 text-textPrimary">
        Bitcoin (BTC-USD) 折線圖
      </h2>
      <p class="text-textSecondary mb-4 text-sm">
        最近一個月資料 - 使用 YAPI Mock Server
      </p>

      <!-- 載入中 -->
      <div v-if="btcLoading" class="bg-sys-surface rounded-lg p-8 mb-4 text-center">
        <p class="text-textSecondary">
          載入中...
        </p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="btcError" class="bg-sys-surface rounded-lg p-4 mb-4">
        <p class="text-red-500">
          {{ btcError }}
        </p>
      </div>

      <!-- 折線圖容器 -->
      <div v-else class="bg-sys-surface rounded-lg p-4 mb-2">
        <div ref="lineChartContainer" class="w-full" />
      </div>

      <!-- 說明 -->
      <div v-if="!btcLoading && !btcError" class="text-textMuted text-sm">
        <p>顯示資料筆數：{{ btcData.length }} 筆</p>
      </div>
    </div>

    <!-- 資料來源說明 -->
    <div class="bg-sys-surface rounded-lg p-4 mb-4">
      <h3 class="font-semibold mb-2 text-textPrimary">
        資料來源
      </h3>
      <p class="text-textMuted text-sm">
        API: <code class="bg-gray-700 px-2 py-1 rounded">https://yapi.zeabur.app/mock/27/v8/finance/chart</code>
      </p>
    </div>

    <!-- 返回首頁 -->
    <router-link :to="{ name: 'Home' }" class="inline-block text-textSecondary hover:text-primary">
      ← 返回首頁
    </router-link>
  </div>
</template>

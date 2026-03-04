<script setup lang="ts">
import { useBusinessApiClient } from '~/lib/api/clients'

definePageMeta({
  layout: 'default',
  title: 'API 使用方法測試',
})

interface ApiTestResult {
  method: string
  url: string
  data: unknown
  timestamp: number
}

const api = useBusinessApiClient()

// 測試結果
const test1Result = ref<ApiTestResult | null>(null)
const test2Result = ref<ApiTestResult | null>(null)
const test3Result = ref<ApiTestResult | null>(null)

// Loading 狀態
const test1Loading = ref(false)
const test2Loading = ref(false)
const test3Loading = ref(false)

// Dialog 控制
const showDialog = ref(false)
const currentResult = ref<ApiTestResult | null>(null)

// 測試 1：Nuxt Server API
async function runTest1() {
  test1Loading.value = true
  try {
    const data = await api('/api/user/info', {
      method: 'GET',
      _meta: {
        skipLoading: true, // 不顯示全域 loading
      },
    })

    test1Result.value = {
      method: 'GET',
      url: '/api/user/info',
      data,
      timestamp: Date.now(),
    }
  }
  catch (error) {
    console.error('Test 1 failed:', error)
    test1Result.value = {
      method: 'GET',
      url: '/api/user/info',
      data: { error: String(error) },
      timestamp: Date.now(),
    }
  }
  finally {
    test1Loading.value = false
  }
}

// 測試 2：自定義 baseURL
async function runTest2() {
  test2Loading.value = true
  try {
    const data = await api('/v1/api/user/info', {
      method: 'GET',
      _meta: {
        baseURL: 'https://yapi.zeabur.app/mock/27',
        skipLoading: true,
      },
    })

    test2Result.value = {
      method: 'GET',
      url: 'https://yapi.zeabur.app/mock/27/v1/api/user/info',
      data,
      timestamp: Date.now(),
    }
  }
  catch (error) {
    console.error('Test 2 failed:', error)
    test2Result.value = {
      method: 'GET',
      url: 'https://yapi.zeabur.app/mock/27/v1/api/user/info',
      data: { error: String(error) },
      timestamp: Date.now(),
    }
  }
  finally {
    test2Loading.value = false
  }
}

// 測試 3：useYApiMock
async function runTest3() {
  test3Loading.value = true
  try {
    const data = await api('/v1/api/user/info', {
      method: 'GET',
      _meta: {
        useYApiMock: true,
        skipLoading: true,
      },
    })

    test3Result.value = {
      method: 'GET',
      url: `${import.meta.env.VITE_YAPI_BASE_URL}/v1/api/user/info`,
      data,
      timestamp: Date.now(),
    }
  }
  catch (error) {
    console.error('Test 3 failed:', error)
    test3Result.value = {
      method: 'GET',
      url: `${import.meta.env.VITE_YAPI_BASE_URL}/v1/api/user/info`,
      data: { error: String(error) },
      timestamp: Date.now(),
    }
  }
  finally {
    test3Loading.value = false
  }
}

// 顯示結果
function viewResult(result: ApiTestResult | null) {
  if (!result)
    return
  currentResult.value = result
  showDialog.value = true
}

// 格式化 JSON
const formattedJson = computed(() => {
  if (!currentResult.value)
    return ''
  return JSON.stringify(currentResult.value.data, null, 2)
})

// 環境變數
const yapiBaseUrl = import.meta.env.VITE_YAPI_BASE_URL || '未設定'
const allUseYApiMock = import.meta.env.VITE_ALL_USE_YAPI_MOCK || 'false'
</script>

<template>
  <div class="min-h-screen bg-sys-page p-4">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-textBase mb-2">
          API 使用方法測試
        </h1>
        <p class="text-textSecondary">
          測試三種不同的 API 調用方式，了解 nuxt-app 的 API 架構
        </p>
      </div>

      <!-- 測試卡片 -->
      <div class="space-y-4">
        <!-- 測試 1 -->
        <q-card class="bg-sys-card">
          <q-card-section>
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-textBase mb-1">
                  測試 1：Nuxt Server API（基本路由）
                </h3>
                <p class="text-textSecondary text-sm mb-2">
                  使用 Nuxt 內建的 server routes，適合 SSR 場景
                </p>
                <code class="text-xs bg-sys-raised px-2 py-1 rounded text-textMuted">
                  GET /api/user/info
                </code>
              </div>
              <q-badge
                v-if="test1Result"
                color="positive"
                label="✓"
              />
            </div>

            <div class="flex gap-2">
              <q-btn
                unelevated
                class="btn-gradient-primary"
                label="執行測試"
                icon="play_arrow"
                :loading="test1Loading"
                @click="runTest1"
              />
              <q-btn
                v-if="test1Result"
                outline
                label="查看結果"
                icon="visibility"
                @click="viewResult(test1Result)"
              />
            </div>

            <div v-if="test1Result" class="mt-4 text-xs text-textMuted">
              最後執行：{{ new Date(test1Result.timestamp).toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>

        <!-- 測試 2 -->
        <q-card class="bg-sys-card">
          <q-card-section>
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-textBase mb-1">
                  測試 2：自定義 baseURL
                </h3>
                <p class="text-textSecondary text-sm mb-2">
                  使用 _meta.baseURL 完全覆蓋預設 baseURL
                </p>
                <code class="text-xs bg-sys-raised px-2 py-1 rounded text-textMuted break-all">
                  GET https://yapi.zeabur.app/mock/27/v1/api/user/info
                </code>
              </div>
              <q-badge
                v-if="test2Result"
                color="positive"
                label="✓"
              />
            </div>

            <div class="flex gap-2">
              <q-btn
                unelevated
                class="btn-gradient-primary"
                label="執行測試"
                icon="play_arrow"
                :loading="test2Loading"
                @click="runTest2"
              />
              <q-btn
                v-if="test2Result"
                outline
                label="查看結果"
                icon="visibility"
                @click="viewResult(test2Result)"
              />
            </div>

            <div v-if="test2Result" class="mt-4 text-xs text-textMuted">
              最後執行：{{ new Date(test2Result.timestamp).toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>

        <!-- 測試 3 -->
        <q-card class="bg-sys-card">
          <q-card-section>
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-textBase mb-1">
                  測試 3：useYApiMock
                </h3>
                <p class="text-textSecondary text-sm mb-2">
                  使用環境變數切換 Mock API（開發階段推薦）
                </p>
                <code class="text-xs bg-sys-raised px-2 py-1 rounded text-textMuted">
                  GET /v1/api/user/info + useYApiMock: true
                </code>
              </div>
              <q-badge
                v-if="test3Result"
                color="positive"
                label="✓"
              />
            </div>

            <div class="flex gap-2">
              <q-btn
                unelevated
                class="btn-gradient-primary"
                label="執行測試"
                icon="play_arrow"
                :loading="test3Loading"
                @click="runTest3"
              />
              <q-btn
                v-if="test3Result"
                outline
                label="查看結果"
                icon="visibility"
                @click="viewResult(test3Result)"
              />
            </div>

            <div v-if="test3Result" class="mt-4 text-xs text-textMuted">
              最後執行：{{ new Date(test3Result.timestamp).toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>

        <!-- 環境變數說明 -->
        <q-card class="bg-sys-card border-l-4 border-primary">
          <q-card-section>
            <h4 class="text-lg font-semibold text-textBase mb-2">
              環境變數配置
            </h4>
            <div class="space-y-2 text-sm">
              <div>
                <code class="text-xs bg-sys-raised px-2 py-1 rounded text-textMuted">
                  VITE_YAPI_BASE_URL
                </code>
                <span class="text-textSecondary ml-2">
                  = {{ yapiBaseUrl }}
                </span>
              </div>
              <div>
                <code class="text-xs bg-sys-raised px-2 py-1 rounded text-textMuted">
                  VITE_ALL_USE_YAPI_MOCK
                </code>
                <span class="text-textSecondary ml-2">
                  = {{ allUseYApiMock }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Result Dialog -->
    <q-dialog v-model="showDialog">
      <q-card class="bg-sys-card w-full max-w-2xl mx-4">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            API 回應結果
          </div>
          <div class="text-caption">
            {{ currentResult?.method }} {{ currentResult?.url }}
          </div>
        </q-card-section>

        <q-card-section>
          <CodeViewer :code="formattedJson" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="關閉"
            color="primary"
            @click="showDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

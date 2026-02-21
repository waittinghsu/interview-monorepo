<script setup>
import { httpClient } from '@/api'

const logs = ref([])

function addLog(type, message) {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message,
  })
}

// 測試 1：正常請求（會被 MSW 攔截並回傳 business format）
async function testNormalRequest() {
  addLog('info', '發送正常請求...')
  try {
    const data = await httpClient.get('/v1/api/user/info', {
      headers: { Authorization: 'Bearer mock-token-1-123' },
    })
    addLog('success', `成功：${JSON.stringify(data)}`)
  }
  catch (err) {
    addLog('error', `錯誤：${err.message}`)
  }
}

// 測試 2：Business Error（code !== 200）
async function testBusinessError() {
  addLog('info', '發送會觸發 Business Error 的請求...')
  try {
    // 登入錯誤的帳密會回傳 code: '401'
    const data = await httpClient.post('/api/user/login', {
      email: 'wrong@example.com',
      password: 'wrong',
    })
    addLog('success', `成功：${JSON.stringify(data)}`)
  }
  catch (err) {
    addLog('error', `Business Error：${err.message} (code: ${err.code})`)
  }
}

// 測試 3：HTTP 401 錯誤
async function testHttp401() {
  addLog('info', '發送未授權請求（401）...')
  try {
    const data = await httpClient.get('/v1/api/user/info')
    addLog('success', `成功：${JSON.stringify(data)}`)
  }
  catch (err) {
    addLog('error', `HTTP 401：${err.message}`)
  }
}

// 測試 4：skipLoading
async function testSkipLoading() {
  addLog('info', '發送請求（skipLoading: true）...')
  try {
    const data = await httpClient.get('/v1/api/user/info', {
      headers: { Authorization: 'Bearer mock-token-1-123' },
      _meta: { skipLoading: true },
    })
    addLog('success', `成功（不計入 loading）：${JSON.stringify(data)}`)
  }
  catch (err) {
    addLog('error', `錯誤：${err.message}`)
  }
}

// 測試 5：rawResponse
async function testRawResponse() {
  addLog('info', '發送請求（rawResponse: true）...')
  try {
    const data = await httpClient.get('/v1/api/user/info', {
      headers: { Authorization: 'Bearer mock-token-1-123' },
      _meta: { rawResponse: true },
    })
    addLog('success', `成功（完整 response）：${JSON.stringify(data)}`)
  }
  catch (err) {
    addLog('error', `錯誤：${err.message}`)
  }
}

function clearLogs() {
  logs.value = []
}
</script>

<template>
  <div class="min-h-screen bg-sys-page p-6">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-3xl font-bold text-primary">
        API 攔截器測試頁面
      </h1>

      <!-- Test Buttons -->
      <q-card class="mb-6 bg-sys-card">
        <q-card-section>
          <div class="mb-4 text-lg font-semibold text-textBase">
            測試項目
          </div>
          <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <q-btn
              unelevated
              color="primary"
              label="1. 正常請求"
              icon="check_circle"
              @click="testNormalRequest"
            />
            <q-btn
              unelevated
              color="warning"
              label="2. Business Error"
              icon="warning"
              @click="testBusinessError"
            />
            <q-btn
              unelevated
              color="negative"
              label="3. HTTP 401"
              icon="block"
              @click="testHttp401"
            />
            <q-btn
              unelevated
              color="info"
              label="4. Skip Loading"
              icon="fast_forward"
              @click="testSkipLoading"
            />
            <q-btn
              unelevated
              color="secondary"
              label="5. Raw Response"
              icon="code"
              @click="testRawResponse"
            />
            <q-btn
              flat
              label="清除 Log"
              icon="delete"
              class="text-textSecondary"
              @click="clearLogs"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Expected Behavior -->
      <q-card class="mb-6 bg-sys-card">
        <q-card-section>
          <div class="mb-3 text-lg font-semibold text-textBase">
            預期行為
          </div>
          <ul class="space-y-2 text-sm text-textSecondary">
            <li>✅ Console 顯示 [Track] 和 [Crypto] 埋點 log</li>
            <li>✅ 頂部顯示 loading bar（test 4 除外）</li>
            <li>✅ 右下角顯示 pending count（test 4 除外）</li>
            <li>✅ Test 1：解包後只回傳 data 內容</li>
            <li>✅ Test 2：觸發 onBusinessError，拋出 error</li>
            <li>✅ Test 3：觸發 onUnauthorized，清除 token 並導向登入</li>
            <li>✅ Test 5：回傳完整 response（含 code/msg/data）</li>
          </ul>
        </q-card-section>
      </q-card>

      <!-- Logs -->
      <q-card class="bg-sys-card">
        <q-card-section>
          <div class="mb-3 flex items-center justify-between">
            <div class="text-lg font-semibold text-textBase">
              執行記錄
            </div>
            <q-chip
              v-if="logs.length > 0"
              dense
              color="primary"
              text-color="white"
            >
              {{ logs.length }} 筆
            </q-chip>
          </div>
          <div v-if="logs.length === 0" class="py-8 text-center text-textMuted">
            點擊上方按鈕開始測試
          </div>
          <div v-else class="max-h-96 space-y-2 overflow-auto">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="rounded border border-sys-border bg-sys-raised p-3 font-mono text-xs"
            >
              <div class="mb-1 flex items-center gap-2">
                <q-icon
                  :name="log.type === 'error' ? 'error' : log.type === 'success' ? 'check_circle' : 'info'"
                  :class="{
                    'text-error': log.type === 'error',
                    'text-success': log.type === 'success',
                    'text-info': log.type === 'info',
                  }"
                />
                <span class="text-textMuted">{{ log.time }}</span>
              </div>
              <div :class="{
                'text-error': log.type === 'error',
                'text-success': log.type === 'success',
                'text-textBase': log.type === 'info',
              }">
                {{ log.message }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <q-btn
          flat
          label="返回首頁"
          icon="home"
          class="text-textSecondary"
          to="/"
        />
      </div>
    </div>
  </div>
</template>

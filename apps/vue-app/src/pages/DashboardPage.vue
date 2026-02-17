<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const summaryStats = [
  { label: '共線人數', value: '5', suffix: '/ 10', icon: 'i-mdi-account-group', accent: 'text-cyan-300' },
  { label: '今日訊息', value: '91,015', suffix: '', icon: 'i-mdi-message-processing', accent: 'text-amber-300' },
  { label: '平均互動', value: '325.9', suffix: '', icon: 'i-mdi-chart-line', accent: 'text-purple-300' },
  { label: '活躍平台', value: '7', suffix: '', icon: 'i-mdi-lan-connect', accent: 'text-emerald-300' },
]

const personas = [
  { name: 'Alex Chen', role: 'Alex | AI Builder', tags: ['任務', '執行'], tasks: 4, status: 'online', lastActive: '2 min ago' },
  { name: 'Sophie Lin', role: 'Sophia | Crypto', tags: ['洞察', '分析'], tasks: 3, status: 'online', lastActive: '5 min ago' },
  { name: 'Jake Morrison', role: 'Jake | Gaming', tags: ['活動', '直播'], tasks: 2, status: 'away', lastActive: '12 min ago' },
  { name: 'Carlos Ruiz', role: 'Carlos | Startup', tags: ['專案', '建議'], tasks: 6, status: 'online', lastActive: '1 min ago' },
  { name: 'Luna Kim', role: 'Luna | K-Content', tags: ['社群', '企劃'], tasks: 5, status: 'online', lastActive: '8 min ago' },
  { name: 'Maria Santos', role: 'Maria | Design', tags: ['UI', '設計'], tasks: 3, status: 'offline', lastActive: '1 hour ago' },
  { name: 'Aisha Patel', role: 'Aisha | ML Research', tags: ['模型', '實驗'], tasks: 4, status: 'online', lastActive: '2 hours ago' },
  { name: 'Yuki Tanaka', role: 'Yuki | Art & Tech', tags: ['藝術', '互動'], tasks: 2, status: 'away', lastActive: '45 min ago' },
]

const systemMetrics = [
  { label: 'CPU UPTIME', value: 92, color: 'cyan-4', tint: 'text-cyan-3', uptime: '4h 17m' },
  { label: 'RAM', value: 50, color: 'blue-5', tint: 'text-blue-3', uptime: '4h 17m' },
  { label: 'PTY', value: 8, color: 'green-5', tint: 'text-emerald-3', uptime: '4h 17m' },
  { label: 'WS', value: 0, color: 'orange-5', tint: 'text-amber-3', uptime: '4h 17m' },
]

const aiUsages = [
  {
    name: 'test-pty-account',
    provider: 'claude-code',
    models: [
      { name: 'Opus', percent: 76, time: '2h 15m', color: 'cyan-4' },
      { name: 'Sonnet', percent: 43, time: '1h 09m', color: 'purple-4' },
      { name: 'Haiku', percent: 24, time: '38m', color: 'orange-4' },
    ],
  },
  {
    name: 'test-ws-account',
    provider: 'claude-code',
    models: [
      { name: 'Opus', percent: 52, time: '1h 42m', color: 'cyan-4' },
      { name: 'Sonnet', percent: 33, time: '55m', color: 'purple-4' },
      { name: 'Haiku', percent: 12, time: '18m', color: 'orange-4' },
    ],
  },
  {
    name: 'test-event',
    provider: 'codex',
    models: [
      { name: 'GPT-4o', percent: 64, time: '3h 02m', color: 'green-4' },
      { name: 'o3-pro', percent: 28, time: '1h 19m', color: 'cyan-4' },
      { name: 'Codex', percent: 19, time: '54m', color: 'blue-4' },
    ],
  },
  {
    name: 'test-pty-alt',
    provider: 'claude-code',
    models: [
      { name: 'Opus', percent: 44, time: '1h 25m', color: 'cyan-4' },
      { name: 'Sonnet', percent: 30, time: '57m', color: 'purple-4' },
      { name: 'Haiku', percent: 22, time: '42m', color: 'orange-4' },
    ],
  },
]

const eventLogs = [
  { time: '12:53:21', message: 'Proxy test passed — Latency: 120ms', color: 'text-cyan-3' },
  { time: '12:51:36', message: 'Persona luna_kdrama posted × 12 (450 total)', color: 'text-purple-3' },
  { time: '12:49:20', message: 'Chrome profile Persona-007 launched (CDP)', color: 'text-amber-3' },
  { time: '12:46:33', message: 'WebSocket client connected (192.168.1.5)', color: 'text-emerald-3' },
  { time: '12:43:15', message: 'Scheduler triggered: 3 tasks queued (fast lane)', color: 'text-cyan-3' },
  { time: '12:39:08', message: 'PTY session started • OpenAI Dev [codex]', color: 'text-purple-3' },
  { time: '12:27:55', message: 'Account ace-801 activated', color: 'text-emerald-3' },
  { time: '12:25:10', message: 'System initialized • AISocial v0.10.0', color: 'text-blue-3' },
]

const platformStats = [
  { name: 'X Twitter', icon: 'i-mdi-twitter', posts: 1613, reach: '48,320', delta: '+0.5%', orgs: 43, color: 'text-cyan-3' },
  { name: 'GitHub', icon: 'i-mdi-github', posts: 418, reach: '1,105', delta: '+0.3%', orgs: 12, color: 'text-emerald-3' },
  { name: 'Discord', icon: 'i-mdi-discord', posts: 1990, reach: '9,320', delta: '+1.8%', orgs: 33, color: 'text-purple-3' },
  { name: 'Instagram', icon: 'i-mdi-instagram', posts: 503, reach: '26,450', delta: '+2.1%', orgs: 18, color: 'text-pink-3' },
  { name: 'Telegram', icon: 'i-mdi-telegram', posts: 179, reach: '3,215', delta: '+0.9%', orgs: 7, color: 'text-cyan-3' },
  { name: 'YouTube', icon: 'i-mdi-youtube', posts: 108, reach: '19,700', delta: '+3.4%', orgs: 5, color: 'text-red-4' },
  { name: 'LinkedIn', icon: 'i-mdi-linkedin', posts: 96, reach: '9,980', delta: '+0.8%', orgs: 9, color: 'text-blue-3' },
]

const quickActions = [
  { label: '新增人格', icon: 'i-mdi-account-plus-outline' },
  { label: '啟動 CHROME', icon: 'i-mdi-google-chrome' },
  { label: '派發任務', icon: 'i-mdi-rocket-launch-outline' },
  { label: '代理設定', icon: 'i-mdi-cog-outline' },
]

const now = ref(new Date())
let timerId

onMounted(() => {
  timerId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(timerId)
})

const formattedTime = computed(() => {
  return now.value.toLocaleTimeString('en-GB', { hour12: false })
})
</script>

<template>
  <div class="dashboard-wrapper text-gray-100">
    <div class="space-y-6">
      <!-- Page Header / Navigation mimic -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-semibold tracking-[0.3em] text-cyan-300">AISOCIAL</span>
            <q-badge color="primary" class="bg-primary/10 text-primary" label="v0.10" />
          </div>
          <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gray-300">
            <span>Dashboard</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-gray-300">
          <div class="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1">
            <i class="i-mdi-translate text-cyan-300" />
            <span>EN</span>
          </div>
          <div class="flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-400/10 px-3 py-1">
            <i class="i-mdi-clock-outline text-purple-300" />
            <span>{{ formattedTime }}</span>
          </div>
          <div class="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
            <span class="relative mr-1 inline-flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <span>ONLINE</span>
          </div>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <q-card v-for="stat in summaryStats" :key="stat.label" class="cyber-card">
          <q-card-section class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <i :class="[stat.icon, stat.accent, 'text-2xl']" />
            </div>
            <div>
              <div class="text-sm text-gray-400">{{ stat.label }}</div>
              <div class="text-2xl font-bold text-gray-100">
                {{ stat.value }}<span class="text-sm text-gray-400"> {{ stat.suffix }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <!-- Personas + AI usage -->
        <div class="space-y-6">
          <q-card class="cyber-card">
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="text-lg font-semibold text-gray-100">人格快覽</div>
                <div class="text-xs text-gray-400">目前 8 / 10 名人格在線</div>
              </div>
              <q-chip color="primary" class="bg-primary/10 text-primary" icon="person">
                Active
              </q-chip>
            </q-card-section>
            <q-separator dark class="opacity-20" />
            <q-card-section>
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div v-for="persona in personas" :key="persona.name" class="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div class="mb-3 flex items-center gap-3">
                    <q-avatar size="38px" class="bg-cyan-500/10">
                      <i class="i-mdi-account text-cyan-200 text-xl" />
                      <span :class="['status-dot', persona.status]" />
                    </q-avatar>
                    <div>
                      <div class="text-sm font-semibold text-gray-100">{{ persona.name }}</div>
                      <div class="text-xs text-gray-400">{{ persona.role }}</div>
                    </div>
                  </div>
                  <div class="mb-3 flex flex-wrap gap-2">
                    <q-badge v-for="tag in persona.tags" :key="tag" class="bg-white/10 text-[11px] uppercase tracking-wide text-gray-300" rounded>
                      {{ tag }}
                    </q-badge>
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <i class="i-mdi-clipboard-text-outline text-cyan-300" />
                      {{ persona.tasks }} 任務
                    </span>
                    <span>{{ persona.lastActive }}</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="cyber-card">
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="text-lg font-semibold text-gray-100">AI Usage</div>
                <div class="text-xs text-gray-400">追蹤 Claude / OpenAI 帳號使用量</div>
              </div>
              <q-btn flat dense icon="i-mdi-refresh" class="text-cyan-300" round />
            </q-card-section>
            <q-separator dark class="opacity-20" />
            <q-card-section class="space-y-4">
              <div v-for="account in aiUsages" :key="account.name" class="rounded-xl border border-white/10 bg-white/5">
                <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div>
                    <div class="text-sm font-semibold text-gray-100">{{ account.name }}</div>
                    <div class="text-xs text-gray-500">{{ account.provider }}</div>
                  </div>
                  <q-badge color="primary" class="bg-primary/10 text-primary" label="monitoring" />
                </div>
                <div class="space-y-3 px-4 py-3">
                  <div v-for="model in account.models" :key="model.name" class="space-y-1">
                    <div class="flex items-center justify-between text-xs text-gray-400">
                      <span>{{ model.name }}</span>
                      <span>{{ model.time }} • {{ model.percent }}%</span>
                    </div>
                    <q-linear-progress :value="model.percent / 100" :color="model.color" track-color="grey-10" class="progress-bar" rounded />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Right column: system + events + platform + quick actions -->
        <div class="space-y-6">
          <q-card class="cyber-card">
            <q-card-section>
              <div class="mb-4 flex items-center justify-between">
                <div class="text-lg font-semibold text-gray-100">系統狀態</div>
                <q-badge class="bg-emerald-400/10 text-emerald-300" label="Uptime" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="metric in systemMetrics" :key="metric.label" class="flex flex-col items-center gap-3 rounded-xl bg-white/5 p-4 text-center">
                  <q-circular-progress :value="metric.value" :thickness="0.18" size="90px" :color="metric.color" track-color="grey-10" show-value>
                    <div class="text-xl font-semibold text-gray-100">{{ metric.value }}%</div>
                  </q-circular-progress>
                  <div class="text-xs uppercase tracking-[0.3em] text-gray-400">{{ metric.label }}</div>
                  <div :class="['text-xs font-semibold', metric.tint]">{{ metric.uptime }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="cyber-card">
            <q-card-section>
              <div class="text-lg font-semibold text-gray-100">事件日誌</div>
            </q-card-section>
            <q-separator dark class="opacity-20" />
            <q-card-section class="max-h-64 space-y-3 overflow-auto pr-1">
              <div v-for="log in eventLogs" :key="log.time + log.message" class="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
                <span class="text-gray-500">[{{ log.time }}]</span>
                <span :class="log.color">{{ log.message }}</span>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="cyber-card">
            <q-card-section class="flex items-center justify-between">
              <div class="text-lg font-semibold text-gray-100">平台分布</div>
              <q-btn flat dense icon="i-mdi-tune" class="text-gray-400" round />
            </q-card-section>
            <q-separator dark class="opacity-20" />
            <q-card-section class="space-y-3">
              <div v-for="platform in platformStats" :key="platform.name" class="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <div class="flex items-center gap-3">
                  <q-avatar size="32px" class="bg-white/10">
                    <i :class="[platform.icon, platform.color, 'text-xl']" />
                  </q-avatar>
                  <div>
                    <div class="text-sm font-semibold text-gray-100">{{ platform.name }}</div>
                    <div class="text-xs text-gray-400">貼文 {{ platform.posts }} • 組織 {{ platform.orgs }}</div>
                  </div>
                </div>
                <div class="text-right text-xs text-gray-300">
                  <div>觸及 {{ platform.reach }}</div>
                  <div :class="platform.color">{{ platform.delta }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="cyber-card">
            <q-card-section>
              <div class="text-lg font-semibold text-gray-100">快速操作</div>
            </q-card-section>
            <q-card-section>
              <div class="grid grid-cols-2 gap-3">
                <q-btn
                  v-for="action in quickActions"
                  :key="action.label"
                  class="cyber-button"
                  glossy
                  unelevated
                  :label="action.label"
                  :icon="action.icon"
                  text-color="gray-200"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  min-height: calc(100vh - 140px);
  background: linear-gradient(180deg, #0a0e27 0%, #131829 100%);
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(60, 72, 115, 0.35);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.cyber-card {
  background: rgba(18, 24, 46, 0.88);
  border: 1px solid rgba(65, 76, 118, 0.45);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 45px rgba(5, 11, 30, 0.55);
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  border: 2px solid rgba(10, 14, 39, 0.85);
}

.status-dot.online {
  background: #34d399;
}

.status-dot.away {
  background: #fbbf24;
}

.status-dot.offline {
  background: #f87171;
}

.progress-bar {
  height: 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
}

.cyber-button {
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(90, 51, 255, 0.15));
  border: 1px solid rgba(97, 125, 255, 0.35);
  border-radius: 14px;
  text-transform: none;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.cyber-button:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 255, 222, 0.6);
}

@media (max-width: 1024px) {
  .dashboard-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .dashboard-wrapper {
    padding: 0.75rem;
  }
}
</style>

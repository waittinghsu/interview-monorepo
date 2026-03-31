<script setup lang="ts">
import CyberCircle from '~/components/cyber/CyberCircle.vue'
import { useRefetchUserInfo, useUpdateUserInfoMutation, useUserInfoQuery, useUserService } from '~/features/user'

/**
 * SSR: 使用 useAsyncData 預先取得資料
 * 這部分只在服務端執行一次
 */
const { data: ssrData } = await useAsyncData('userInfo', async () => {
  const service = useUserService()
  return await service.getUserInfo()
})

/**
 * CSR: 使用 TanStack Query 管理客戶端狀態
 * 使用 SSR 資料作為 initialData，避免客戶端重複請求
 */
const { data: userInfo, isPending, error, refetch } = useUserInfoQuery(ssrData.value)

/**
 * Mutation: 更新會員資料
 */
const updateMutation = useUpdateUserInfoMutation()

/**
 * 手動重新取得
 */
const refetchUserInfo = useRefetchUserInfo()

/**
 * 計算屬性
 */
const displayUser = computed(() => userInfo.value || ssrData.value)

const avatarUrl = computed(() => '/common/avatar.jpg')

const levelColor = computed(() => {
  const level = displayUser.value?.level || 0
  if (level >= 10)
    return 'text-cyber-purple'
  if (level >= 7)
    return 'text-cyber-cyan'
  if (level >= 4)
    return 'text-cyber-emerald'
  return 'text-textMuted'
})

/**
 * 更新會員暱稱範例
 */
const showNicknameDialog = ref(false)
const newNickname = ref('')

function handleUpdateNickname() {
  newNickname.value = displayUser.value?.nickname || ''
  showNicknameDialog.value = true
}

function confirmUpdateNickname() {
  if (newNickname.value.trim()) {
    updateMutation.mutate({ nickname: newNickname.value.trim() })
    showNicknameDialog.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-sys-page p-6">
    <div class="dashboard-wrapper max-w-4xl mx-auto">
      <!-- 架構說明 -->
      <div class="mb-6 p-4 rounded-xl border border-sys-border-strong bg-sys-card">
        <h2 class="text-lg font-bold mb-2 text-primary flex items-center gap-2">
          <q-icon name="engineering" size="24px" />
          <span>新架構特點</span>
        </h2>
        <ul class="text-sm text-textBase space-y-1">
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>useApiClient</strong>: 統一攔截器 + Abort 管理</span>
          </li>
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>Service 層</strong>: 封裝 API 調用</span>
          </li>
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>Zod Schema</strong>: 型別驗證</span>
          </li>
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>TanStack Query</strong>: 客戶端狀態管理</span>
          </li>
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>useAsyncData</strong>: SSR 預取資料</span>
          </li>
          <li class="flex items-center gap-2">
            <q-icon name="check_circle" class="text-secondary" size="18px" />
            <span><strong>模組化結構</strong>: modules/user/{schemas,services,queries}</span>
          </li>
        </ul>
      </div>

      <h1 class="text-3xl font-bold mb-8 text-textBase">
        會員資料頁面
      </h1>

      <!-- Loading 狀態 -->
      <div v-if="isPending && !displayUser" class="text-center py-8">
        <div class="text-lg text-textSecondary">
          載入中...
        </div>
      </div>

      <!-- Error 狀態 -->
      <div v-else-if="error" class="bg-sys-card border-2 border-error text-error px-4 py-3 rounded-xl">
        <strong>錯誤：</strong> {{ error.message }}
      </div>

      <!-- 會員資料顯示 -->
      <div v-else-if="displayUser" class="space-y-6">
        <!-- 會員卡片 -->
        <q-card class="cyber-card">
          <q-card-section>
            <div class="flex flex-col md:flex-row items-center gap-6 mb-6">
              <!-- 頭像 -->
              <div class="relative flex-shrink-0">
                <CyberCircle class="rotate-27" :size="120" color="#22d3ee" :progress="displayUser.level * 8.33" />
                <img
                  :src="avatarUrl"
                  alt="Avatar"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[53%] w-20 h-20 rounded-full border-2 border-primary"
                >
              </div>

              <!-- 基本資訊 -->
              <div class="flex-1 text-center md:text-left">
                <h2 class="text-2xl font-bold mb-2 text-textBase">
                  {{ displayUser.name }}
                </h2>
                <p class="text-textMuted mb-1">
                  @{{ displayUser.nickname }}
                </p>
                <p class="font-semibold" :class="[levelColor]">
                  等級 {{ displayUser.level }} / 12
                </p>
              </div>

              <!-- 儲值金額 -->
              <div class="text-center md:text-right">
                <p class="text-sm text-textSecondary mb-1">
                  帳戶餘額
                </p>
                <div class="flex items-center justify-center md:justify-end gap-2">
                  <!-- 脈動綠點（活躍狀態） -->
                  <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                  </span>
                  <p class="text-3xl font-bold text-secondary glow-success">
                    ${{ displayUser.balance }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 詳細資訊 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-sys-border-strong/30">
              <div>
                <p class="text-sm text-textSecondary">
                  會員編號
                </p>
                <p class="font-semibold text-textBase">
                  #{{ displayUser.memberId }}
                </p>
              </div>
              <div>
                <p class="text-sm text-textSecondary">
                  手機號碼
                </p>
                <p class="font-semibold text-textBase">
                  {{ displayUser.phone }}
                </p>
              </div>
              <div>
                <p class="text-sm text-textSecondary">
                  電子信箱
                </p>
                <p class="font-semibold text-textBase">
                  {{ displayUser.email }}
                </p>
              </div>
              <div>
                <p class="text-sm text-textSecondary">
                  頭像編號
                </p>
                <p class="font-semibold text-textBase">
                  {{ displayUser.avatarId }}
                </p>
              </div>
            </div>

            <!-- 書籤收藏 -->
            <div class="pt-6 border-t border-sys-border-strong/30 mt-6">
              <p class="text-sm text-textSecondary mb-3">
                書籤收藏 ({{ displayUser.bookmarks.length }})
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="bookmark in displayUser.bookmarks"
                  :key="bookmark"
                  class="px-3 py-1 rounded-full text-sm font-medium border border-primary bg-sys-raised text-primary"
                >
                  #{{ bookmark }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 操作按鈕 -->
        <div class="flex gap-4 flex-wrap">
          <q-btn
            unelevated
            class="cyber-button text-textBase"
            label="重新整理 (refetch)"
            icon="refresh"
            :loading="isPending"
            @click="refetch()"
          />

          <q-btn
            unelevated
            class="cyber-button text-textBase"
            label="使快取失效 (invalidate)"
            icon="cached"
            @click="refetchUserInfo()"
          />

          <q-btn
            unelevated
            class="cyber-button text-textBase"
            label="更新暱稱 (mutation)"
            icon="edit"
            :loading="updateMutation.isPending.value"
            @click="handleUpdateNickname"
          />
        </div>

        <!-- Mutation 狀態 -->
        <div v-if="updateMutation.isError.value" class="bg-sys-card border-2 border-error text-error px-4 py-3 rounded-xl">
          <strong>更新失敗：</strong> {{ updateMutation.error.value?.message }}
        </div>

        <div v-if="updateMutation.isSuccess.value" class="bg-sys-card border-2 border-secondary text-secondary px-4 py-3 rounded-xl">
          <strong>更新成功！</strong>
        </div>
      </div>

      <!-- 更新暱稱 Dialog -->
      <q-dialog v-model="showNicknameDialog" class="bg-sys-card">
        <q-card class="cyber-card" style="min-width: 350px">
          <q-card-section>
            <div class="text-lg font-bold text-textBase flex items-center gap-2">
              <q-icon name="edit" class="text-primary" />
              <span>更新暱稱</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="newNickname"
              outlined
              label="新暱稱"
              class="text-textBase"
              autofocus
              @keyup.enter="confirmUpdateNickname"
            >
              <template #prepend>
                <q-icon name="person" class="text-primary" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn
              flat
              label="取消"
              class="text-textSecondary"
              @click="showNicknameDialog = false"
            />
            <q-btn
              unelevated
              label="確認"
              class="cyber-button text-textBase"
              :loading="updateMutation.isPending.value"
              @click="confirmUpdateNickname"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Debug 資訊 -->
      <details class="mt-8 border border-sys-border rounded-xl p-4 bg-sys-card/50">
        <summary class="cursor-pointer font-semibold text-textBase flex items-center gap-2">
          <q-icon name="search" size="20px" />
          <span>Debug 資訊</span>
        </summary>
        <div class="mt-4 space-y-4">
          <div>
            <h4 class="font-semibold mb-2 text-textSecondary">
              SSR 資料:
            </h4>
            <pre class="text-xs overflow-auto bg-sys-page p-2 rounded text-textSecondary">{{ ssrData }}</pre>
          </div>
          <div>
            <h4 class="font-semibold mb-2 text-textSecondary">
              Query 狀態:
            </h4>
            <pre class="text-xs overflow-auto bg-sys-page p-2 rounded text-textSecondary">{{ { data: userInfo, isPending, error: error?.message } }}</pre>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  background: linear-gradient(180deg, var(--color-sys-page) 0%, var(--color-sys-card) 100%);
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--color-sys-border) 35%, transparent);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  border-radius: 20px;
}

.cyber-card {
  background: color-mix(in srgb, var(--color-sys-card) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-sys-border) 45%, transparent);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 45px rgba(5, 11, 30, 0.55);
}

.cyber-button {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-cyber-cyan) 15%, transparent),
    color-mix(in srgb, var(--color-cyber-purple) 15%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--color-sys-border) 35%, transparent);
  font-weight: 600;
  transition: all 0.3s ease;
}

.cyber-button:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-cyber-cyan) 60%, transparent);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
}

.glow-success {
  text-shadow: 0 0 10px rgba(110, 231, 183, 0.5);
}
</style>

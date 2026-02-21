<script setup>
const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''

  if (!form.value.email || !form.value.password) {
    error.value = '請輸入 Email 和密碼'
    return
  }

  loading.value = true
  try {
    await userStore.login({
      email: form.value.email,
      password: form.value.password,
    })
    router.push('/')
  }
  catch (err) {
    error.value = err.message || '登入失敗，請檢查帳號密碼'
    console.error('[Login] Failed:', err)
  }
  finally {
    loading.value = false
  }
}

// 測試用帳號提示（YAPI mock 會回傳 mock 資料）
const testAccount = {
  email: 'test@example.com',
  password: 'password',
}

function fillTestAccount() {
  form.value.email = testAccount.email
  form.value.password = testAccount.password
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-sys-page p-4">
    <q-card class="w-full max-w-md bg-sys-card">
      <q-card-section class="text-center">
        <div class="mb-2 text-3xl font-bold text-primary">
          Interview Vue
        </div>
        <div class="text-sm text-textSecondary">
          登入以繼續使用
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- Email -->
            <q-input
              v-model="form.email"
              outlined
              label="Email"
              type="email"
              autocomplete="email"
              :disable="loading"
              class="text-textBase"
              color="primary"
            >
              <template #prepend>
                <q-icon name="mail" class="text-textSecondary" />
              </template>
            </q-input>

            <!-- Password -->
            <q-input
              v-model="form.password"
              outlined
              label="密碼"
              type="password"
              autocomplete="current-password"
              :disable="loading"
              class="text-textBase"
              color="primary"
              @keyup.enter="handleSubmit"
            >
              <template #prepend>
                <q-icon name="lock" class="text-textSecondary" />
              </template>
            </q-input>

            <!-- Error Message -->
            <q-banner v-if="error" dense rounded class="bg-error/10 text-error">
              <template #avatar>
                <q-icon name="warning" class="text-error" />
              </template>
              {{ error }}
            </q-banner>

            <!-- Test Account Hint -->
            <q-banner dense rounded class="bg-info/10 text-info cursor-pointer" @click="fillTestAccount">
              <template #avatar>
                <q-icon name="info" class="text-info" />
              </template>
              <div class="text-xs">
                測試帳號（點擊填入）：{{ testAccount.email }} / {{ testAccount.password }}
              </div>
            </q-banner>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              unelevated
              class="btn-gradient-primary w-full"
              :loading="loading"
              :disable="loading"
              size="lg"
            >
              登入
            </q-btn>

            <!-- Back to Home -->
            <div class="text-center">
              <q-btn
                flat
                label="返回首頁"
                class="text-textSecondary"
                :disable="loading"
                @click="router.push('/')"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
/* 確保輸入框使用主題色 */
:deep(.q-field__control) {
  color: var(--color-textBase);
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: var(--color-textBase);
}

/* Placeholder 顏色 */
:deep(.q-field__native::placeholder),
:deep(.q-field__input::placeholder) {
  color: var(--color-textMuted);
  opacity: 1;
}

:deep(.q-field__label) {
  color: var(--color-textSecondary);
}

:deep(.q-field--focused .q-field__label) {
  color: var(--color-primary);
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: var(--color-sys-border);
}

:deep(.q-field--outlined.q-field--focused .q-field__control:before) {
  border-color: var(--color-primary);
}
</style>

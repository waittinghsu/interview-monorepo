<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default',
  title: '登入',
})

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: 'omega@yaapi.com',
  password: '123456',
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await userStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    // 登入成功，跳轉到首頁
    router.push('/')
  }
  catch (err: unknown) {
    error.value = err instanceof Error ? err.message : '登入失敗'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-sys-page">
    <q-card class="w-full max-w-md bg-sys-card">
      <q-card-section>
        <h1 class="text-2xl font-bold text-textBase mb-4">
          登入
        </h1>

        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            class="mb-4"
            :rules="[(val) => !!val || '請輸入 Email']"
          />

          <q-input
            v-model="form.password"
            label="密碼"
            type="password"
            outlined
            class="mb-4"
            :rules="[(val) => !!val || '請輸入密碼']"
          />

          <div v-if="error" class="text-red-500 mb-4">
            {{ error }}
          </div>

          <q-btn
            type="submit"
            label="登入"
            unelevated
            class="w-full btn-gradient-primary"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

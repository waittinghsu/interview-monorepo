<script setup>
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex-center min-h-screen">
    <q-card class="text-center p-8">
      <div class="text-8xl mb-4">
        <i class="i-carbon-warning text-orange-500" />
      </div>
      <div class="text-h4 mb-2">
        404
      </div>
      <div class="text-body1 text-grey mb-6">
        找不到頁面
      </div>
      <q-btn color="primary" @click="goHome">
        返回首頁
      </q-btn>
    </q-card>
  </div>
</template>

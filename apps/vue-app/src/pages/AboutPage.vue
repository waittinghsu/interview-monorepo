<script setup>
const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">
      <i class="i-carbon-information mr-2" />
      關於
    </h1>

    <q-card class="max-w-md">
      <q-card-section>
        <div class="text-h6">
          技術堆疊
        </div>
      </q-card-section>

      <q-list>
        <q-item>
          <q-item-section avatar>
            <i class="i-carbon-logo-vue text-2xl text-green-500" />
          </q-item-section>
          <q-item-section>Vue 3 Composition API</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <i class="i-carbon-flash text-2xl text-purple-500" />
          </q-item-section>
          <q-item-section>Vite</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <i class="i-carbon-data-base text-2xl text-yellow-500" />
          </q-item-section>
          <q-item-section>Pinia</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <i class="i-carbon-paint-brush text-2xl text-blue-500" />
          </q-item-section>
          <q-item-section>UnoCSS</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <i class="i-carbon-cube text-2xl text-cyan-500" />
          </q-item-section>
          <q-item-section>Quasar</q-item-section>
        </q-item>
      </q-list>

      <q-card-actions>
        <q-btn flat color="primary" @click="goBack">
          <i class="i-carbon-arrow-left mr-2" />
          返回首頁
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

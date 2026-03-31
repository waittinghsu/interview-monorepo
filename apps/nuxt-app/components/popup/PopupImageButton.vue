<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

const $q = useQuasar()

function onYes() {
  $q.notify({ type: 'positive', message: '感謝您的參與！', position: 'top' })
  emit('dismiss')
}
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl overflow-hidden">
    <div class="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div v-if="task.extra.imageUrl" class="w-full h-full">
        <img :src="task.extra.imageUrl as string" class="w-full h-full object-cover" :alt="task.name">
      </div>
      <div v-else class="text-center text-white">
        <div class="i-mdi-image-outline text-6xl opacity-50" />
        <p class="mt-2 opacity-70 text-sm">
          {{ task.name }}
        </p>
      </div>
    </div>

    <q-card-section>
      <div class="text-lg font-semibold text-textBase">
        {{ (task.extra.title as string) ?? task.name }}
      </div>
      <div class="text-sm text-textSecondary mt-1">
        {{ (task.extra.description as string) ?? '' }}
      </div>
    </q-card-section>

    <q-card-actions align="right" class="gap-2 px-4 pb-4">
      <q-btn
        flat
        label="否"
        class="text-textMuted"
        @click="emit('dismiss')"
      />
      <q-btn
        unelevated
        label="是"
        class="btn-gradient-success px-6"
        @click="onYes"
      />
    </q-card-actions>
  </q-card>
</template>

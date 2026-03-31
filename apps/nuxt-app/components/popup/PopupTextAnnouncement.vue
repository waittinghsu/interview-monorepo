<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

const props = defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

function onYes() {
  const url = props.task.extra.url as string | undefined
  if (url)
    window.open(url, '_blank')
  emit('dismiss')
}
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl">
    <q-card-section class="flex items-center gap-3 border-b border-sys-border">
      <div class="i-mdi-bullhorn text-2xl text-primary" />
      <span class="text-lg font-semibold text-textBase">{{ task.name }}</span>
    </q-card-section>

    <q-card-section class="text-textSecondary leading-relaxed">
      {{ task.extra.message ?? '系統公告' }}
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
        class="btn-gradient-primary px-6"
        @click="onYes"
      />
    </q-card-actions>
  </q-card>
</template>

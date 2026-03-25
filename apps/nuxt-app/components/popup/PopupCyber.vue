<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl overflow-hidden relative" style="background: #0a0f1a;">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 pt-4 pb-2">
      <div class="flex items-center gap-2">
        <div class="i-mdi-orbit text-xl text-cyan-400" />
        <span class="text-base font-semibold text-cyan-300">{{ task.name }}</span>
      </div>
      <q-btn
        flat
        round
        dense
        icon="i-mdi-close"
        class="text-cyan-400"
        @click="emit('dismiss')"
      />
    </div>

    <!-- Cyber visuals -->
    <div class="flex justify-center items-center gap-6 py-6 px-4">
      <CyberRadar :size="160" color="#22d3ee" />
      <div class="flex flex-col items-center gap-3">
        <CyberPulse :size="100" color="#22d3ee" :rings="3" />
        <p class="text-xs text-cyan-400 opacity-70">
          {{ (task.extra.subtitle as string) ?? 'SYSTEM ONLINE' }}
        </p>
      </div>
    </div>

    <!-- Scanline overlay -->
    <div class="absolute inset-0 pointer-events-none" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.03) 2px, rgba(34,211,238,0.03) 4px);" />
  </q-card>
</template>

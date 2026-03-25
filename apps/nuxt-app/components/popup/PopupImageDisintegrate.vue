<script setup lang="ts">
import type { PopupTask } from '~/features/popup'

defineProps<{ task: PopupTask }>()
const emit = defineEmits<{ dismiss: [] }>()

const showImage = ref(true)

function onClose() {
  showImage.value = false
}

function onAfterLeave() {
  emit('dismiss')
}
</script>

<template>
  <q-card class="bg-sys-card w-96 max-w-full rounded-2xl overflow-hidden">
    <div class="flex items-center justify-between px-4 pt-3 pb-2 border-b border-sys-border">
      <span class="text-base font-semibold text-textBase">{{ task.name }}</span>
      <q-btn
        flat
        round
        dense
        icon="i-mdi-close"
        class="text-textMuted"
        @click="onClose"
      />
    </div>

    <div class="relative min-h-56 flex items-center justify-center overflow-hidden">
      <transition-vfx
        :leave-params="{ name: 'disintegrate' }"
        :duration="2000"
        @after-leave="onAfterLeave"
      >
        <div
          v-if="showImage"
          class="w-full h-56 flex flex-col items-center justify-center"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);"
        >
          <div class="i-mdi-image-star text-6xl text-white opacity-80" />
          <p class="mt-3 text-white font-semibold text-lg">
            {{ (task.extra.imageAlt as string) ?? '限時優惠' }}
          </p>
          <p class="text-white opacity-70 text-sm mt-1">
            點擊右上角 X 觸發特效
          </p>
        </div>
      </transition-vfx>
    </div>
  </q-card>
</template>

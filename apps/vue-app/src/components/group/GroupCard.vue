<script setup>
defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="bg-sys-card rounded-2xl overflow-hidden border border-sys-border cursor-pointer transition-all duration-200 active:scale-95"
    :style="{ borderColor: 'transparent' }"
    style="box-shadow: 0 1px 8px rgba(0,0,0,0.3)"
    @click="emit('click', group.id)"
  >
    <!-- 封面圖 -->
    <div class="relative h-[110px] overflow-hidden">
      <img
        v-if="group.cover"
        :src="group.cover"
        :alt="group.name"
        class="w-full h-full object-cover"
      >
      <!-- 無封面時用漸層 -->
      <div
        v-else
        class="w-full h-full flex items-end"
        :style="{ background: `linear-gradient(135deg, ${group.gradientFrom || '#1e1b4b'}, ${group.gradientTo || '#312e81'})` }"
      />
      <!-- 底部漸層遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <!-- 團體名稱 -->
      <div class="absolute bottom-2 left-3 right-3">
        <p class="text-white font-bold text-sm m-0 leading-tight truncate">
          {{ group.name }}
        </p>
        <p class="text-white/60 text-[10px] m-0">
          {{ group.koreanName }}
        </p>
      </div>
    </div>

    <!-- 底部資訊 -->
    <div class="px-3 py-2 flex items-center justify-between">
      <span
        class="text-[10px] font-medium px-2 py-0.5 rounded-full"
        :style="{ background: `${group.color}22`, color: group.color }"
      >
        {{ group.fandomName }}
      </span>
      <q-icon name="chevron_right" size="1rem" class="text-textMuted" />
    </div>
  </div>
</template>

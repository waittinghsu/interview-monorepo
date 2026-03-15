<script setup>
defineProps({
  companies: {
    type: Array,
    required: true,
  },
  activeId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="py-3">
    <div class="flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
      <button
        v-for="company in companies"
        :key="company.id"
        class="flex flex-col items-center flex-shrink-0 min-w-[64px] cursor-pointer bg-transparent border-none p-0 outline-none transition-opacity duration-200"
        :class="activeId && activeId !== company.id ? 'opacity-40' : 'opacity-100'"
        @click="emit('select', company.id)"
      >
        <!-- 公司 Icon 方塊 -->
        <div
          class="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-all duration-200"
          :class="activeId === company.id ? 'border-primary scale-105' : 'border-sys-border'"
          :style="activeId === company.id
            ? { boxShadow: `0 0 12px ${company.color}66` }
            : {}"
        >
          <img
            v-if="company.icon"
            :src="company.icon"
            :alt="company.name"
            class="w-full h-full object-contain"
          >
          <!-- 無圖時顯示漸層色塊 + 縮寫 -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
            :style="{ background: `linear-gradient(135deg, ${company.gradientFrom}, ${company.gradientTo})` }"
          >
            {{ company.shortName.slice(0, 2) }}
          </div>
        </div>
        <span class="text-[11px] text-textSecondary mt-1.5 text-center leading-tight font-medium">
          {{ company.shortName }}
        </span>
      </button>
    </div>
  </div>
</template>

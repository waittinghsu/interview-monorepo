<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    class="flex flex-col items-center gap-1 transition-all duration-150"
    :class="clickable ? 'cursor-pointer active:scale-95' : ''"
    @click="clickable && emit('click', member.id)"
  >
    <!-- 圓形頭像 -->
    <div
      class="w-16 h-16 rounded-full overflow-hidden border-2 border-sys-border flex-shrink-0"
      :style="{ borderColor: member.color || 'transparent' }"
    >
      <img
        v-if="member.photo"
        :src="member.photo"
        :alt="member.name"
        class="w-full h-full object-cover object-top"
      >
      <!-- 無照片時顯示漸層 + 首字 -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-white font-bold text-lg select-none"
        :style="{ background: `radial-gradient(circle at 50% 30%, ${member.color || '#374151'}aa, ${member.color || '#374151'}44)` }"
      >
        {{ member.name.charAt(0) }}
      </div>
    </div>

    <!-- 姓名 -->
    <span class="text-xs text-textBase text-center leading-tight font-medium mt-0.5 w-full truncate px-1">
      {{ member.name }}
    </span>
    <span class="text-[10px] text-textMuted text-center leading-tight">
      {{ member.koreanName }}
    </span>
  </div>
</template>

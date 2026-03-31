<script setup>
defineProps({
  slides: {
    type: Array,
    required: true,
  },
})

const currentSlide = ref(0)
</script>

<template>
  <q-carousel
    v-model="currentSlide"
    animated
    arrows
    navigation
    infinite
    :autoplay="4000"
    transition-prev="slide-right"
    transition-next="slide-left"
    class="h-[200px] w-full"
  >
    <q-carousel-slide
      v-for="(slide, i) in slides"
      :key="slide.id"
      :name="i"
      class="p-0 relative overflow-hidden"
    >
      <!-- 有圖片時顯示圖片，沒有時用漸層色塊 -->
      <img
        v-if="slide.image"
        :src="slide.image"
        :alt="slide.title"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full"
        :style="{ background: `linear-gradient(135deg, ${slide.colorFrom || '#1e1b4b'}, ${slide.colorTo || '#312e81'})` }"
      />

      <!-- 文字覆蓋層 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div class="absolute bottom-3 left-4 right-4">
        <p class="text-white font-bold text-lg m-0 leading-tight drop-shadow">
          {{ slide.title }}
        </p>
        <p v-if="slide.subtitle" class="text-white/70 text-xs m-0 mt-0.5">
          {{ slide.subtitle }}
        </p>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

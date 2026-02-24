<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '相簿',
})

interface Photo {
  id: number
  url: string
  title: string
}

const photos: Photo[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/400/300?random=${i + 1}`,
  title: `Photo ${i + 1}`,
}))
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-textBase mb-6">
        相簿
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="bg-sys-card rounded-lg overflow-hidden border border-sys-border hover:border-textBrand transition-all cursor-pointer group"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="photo.url"
              :alt="photo.title"
              class="w-full h-full object-cover transition-transform group-hover:scale-110"
            >
          </div>
          <div class="p-3 bg-sys-raised">
            <p class="text-textSecondary text-sm">
              {{ photo.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

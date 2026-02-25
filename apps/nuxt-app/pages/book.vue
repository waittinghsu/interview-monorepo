<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '書籍',
})

interface Book {
  id: number
  title: string
  author: string
  status: 'reading' | 'completed' | 'wishlist'
  statusLabel: string
  statusColor: string
}

const books: Book[] = [
  { id: 1, title: 'Neuromancer', author: 'William Gibson', status: 'reading', statusLabel: '閱讀中', statusColor: 'cyber-cyan' },
  { id: 2, title: 'Snow Crash', author: 'Neal Stephenson', status: 'completed', statusLabel: '已完成', statusColor: 'cyber-green' },
  { id: 3, title: 'Do Androids Dream of Electric Sheep?', author: 'Philip K. Dick', status: 'wishlist', statusLabel: '待讀', statusColor: 'cyber-purple' },
  { id: 4, title: 'The Matrix', author: 'Various Authors', status: 'reading', statusLabel: '閱讀中', statusColor: 'cyber-cyan' },
  { id: 5, title: 'Ready Player One', author: 'Ernest Cline', status: 'completed', statusLabel: '已完成', statusColor: 'cyber-green' },
  { id: 6, title: 'Altered Carbon', author: 'Richard K. Morgan', status: 'wishlist', statusLabel: '待讀', statusColor: 'cyber-purple' },
]

function getStatusColorClass(status: Book['status']) {
  const colorMap = {
    reading: 'text-[#22d3ee] bg-[#22d3ee]/10',
    completed: 'text-[#10b981] bg-[#10b981]/10',
    wishlist: 'text-[#a78bfa] bg-[#a78bfa]/10',
  }
  return colorMap[status]
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-textBase mb-6">
        書籍清單
      </h1>

      <div class="space-y-4">
        <div
          v-for="book in books"
          :key="book.id"
          class="bg-sys-card rounded-lg p-6 border border-sys-border hover:border-textBrand transition-all"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-textBase mb-2">
                {{ book.title }}
              </h3>
              <p class="text-textSecondary mb-3">
                作者：{{ book.author }}
              </p>
            </div>
            <div>
              <q-badge
                :class="getStatusColorClass(book.status)"
                :label="book.statusLabel"
                class="px-3 py-1 rounded-full font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

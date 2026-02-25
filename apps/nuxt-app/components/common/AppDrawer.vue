<script setup lang="ts">
interface NavigationItem {
  id: number
  label: string
  icon: string
  route: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const navigationItems: NavigationItem[] = [
  { id: 1, label: '首頁', icon: 'i-mdi-home', route: '/' },
  { id: 2, label: '圖表', icon: 'i-mdi-chart-line', route: '/chart' },
  { id: 3, label: '圈圈叉叉', icon: 'i-mdi-gamepad-variant', route: '/tic-tac-toe' },
  { id: 4, label: '猜數字', icon: 'i-mdi-numeric-4-box-multiple-outline', route: '/number-guess' },
  { id: 5, label: '會員資料', icon: 'i-mdi-account-circle', route: '/user-info' },
  { id: 6, label: '關於', icon: 'i-mdi-information', route: '/about' },
  { id: 7, label: 'SSR 示範', icon: 'i-mdi-server', route: '/ssr-demo' },
  { id: 8, label: '郵件', icon: 'i-mdi-email', route: '/mail' },
  { id: 9, label: '相簿', icon: 'i-mdi-image-multiple', route: '/photo' },
  { id: 10, label: '書籍', icon: 'i-mdi-book-open-page-variant', route: '/book' },
  { id: 11, label: '座位距離', icon: 'i-mdi-grid', route: '/seat-grid' },
  { id: 12, label: '陣列旋轉', icon: 'i-mdi-rotate-right', route: '/seat-rotate' },
  { id: 13, label: 'AI Social', icon: 'i-mdi-view-dashboard', route: '/dashboard' },
]
</script>

<template>
  <q-drawer
    v-model="isOpen"
    show-if-above
    :width="260"
    :breakpoint="1024"
    class="bg-sys-card border-r border-sys-border"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item
          v-for="item in navigationItems"
          :key="item.id"
          v-ripple
          clickable
          :to="item.route"
          active-class="text-textBrand bg-sys-page border-l-4 border-textBrand"
          class="rounded-lg my-1 transition-all hover:bg-sys-page"
        >
          <q-item-section avatar>
            <div class="text-2xl" :class="[item.icon]" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="font-medium">
              {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
interface MenuItem {
  id: number
  label: string
  icon: string
  route?: string
  children?: MenuItem[]
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

const route = useRoute()

// 判斷是否為當前路由或子路由
function isActiveGroup(children?: MenuItem[]) {
  if (!children)
    return false
  return children.some(child => child.route === route.path)
}

const menuItems: MenuItem[] = [
  { id: 1, label: '首頁', icon: 'i-mdi-home', route: '/' },
  { id: 2, label: '會員資料', icon: 'i-mdi-account-circle', route: '/user-info' },
  { id: 3, label: '履歷', icon: 'i-mdi-file-document-outline', route: '/resume' },
  { id: 4, label: '郵件', icon: 'i-mdi-email', route: '/mail' },
  { id: 5, label: '相簿', icon: 'i-mdi-image-multiple', route: '/photo' },
  { id: 6, label: '書籍', icon: 'i-mdi-book-open-page-variant', route: '/book' },
  {
    id: 7,
    label: '開發工具',
    icon: 'i-mdi-tools',
    children: [
      { id: 71, label: 'SSR 示範', icon: 'i-mdi-server', route: '/ssr-demo' },
      { id: 72, label: 'API 測試', icon: 'i-mdi-api', route: '/api-demo' },
    ],
  },
  {
    id: 8,
    label: '算法演示',
    icon: 'i-mdi-brain',
    children: [
      { id: 81, label: '猜數字', icon: 'i-mdi-numeric-4-box-multiple-outline', route: '/number-guess' },
      { id: 82, label: '圈圈叉叉', icon: 'i-mdi-gamepad-variant', route: '/tic-tac-toe' },
      { id: 83, label: '座位距離', icon: 'i-mdi-grid', route: '/seat-grid' },
      { id: 84, label: '陣列旋轉', icon: 'i-mdi-rotate-right', route: '/seat-rotate' },
    ],
  },
  {
    id: 9,
    label: '視覺展示',
    icon: 'i-mdi-palette',
    children: [
      { id: 91, label: '圖表', icon: 'i-mdi-chart-line', route: '/chart' },
      { id: 92, label: 'AI Social', icon: 'i-mdi-view-dashboard', route: '/dashboard' },
      { id: 93, label: 'Transition Effects', icon: 'i-mdi-shimmer', route: '/transition-effects' },
    ],
  },
  { id: 10, label: '關於', icon: 'i-mdi-information', route: '/about' },
]
</script>

<template>
  <q-drawer
    v-model="isOpen"
    :width="260"
    :breakpoint="1024"
    class="bg-sys-card border-r border-sys-border"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <template v-for="item in menuItems" :key="item.id">
          <!-- 有子選單的項目 -->
          <q-expansion-item
            v-if="item.children"
            :default-opened="isActiveGroup(item.children)"
            :icon="item.icon"
            :label="item.label"
            class="menu-expansion rounded-lg my-1"
            header-class="text-textBase hover:bg-sys-page transition-all"
            expand-icon-class="text-textSecondary"
          >
            <q-list padding class="pl-4">
              <q-item
                v-for="child in item.children"
                :key="child.id"
                v-ripple
                clickable
                :to="child.route"
                active-class="text-textBrand bg-sys-page border-l-4 border-textBrand"
                class="rounded-lg my-1 transition-all hover:bg-sys-page"
              >
                <q-item-section avatar>
                  <div class="text-xl" :class="[child.icon]" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="font-medium">
                    {{ child.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- 一般項目（無子選單） -->
          <q-item
            v-else
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
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

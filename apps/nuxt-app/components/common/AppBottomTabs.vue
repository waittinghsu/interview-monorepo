<script setup lang="ts">
interface BottomTab {
  value: string
  label: string
  icon: string
  route: string
}

const bottomTabs: BottomTab[] = [
  { value: '/', label: 'Home', icon: 'home', route: '/' },
  { value: '/mail', label: 'Mail', icon: 'email', route: '/mail' },
  { value: '/about', label: 'About', icon: 'info', route: '/about' },
  { value: '/photo', label: 'Photo', icon: 'photo', route: '/photo' },
  { value: '/book', label: 'Book', icon: 'menu_book', route: '/book' },
]
</script>

<template>
  <q-tabs
    dense
    active-color="textBrand"
    indicator-color="textBrand"
    class="text-textSecondary"
  >
    <q-route-tab
      v-for="tab in bottomTabs"
      :key="tab.value"
      :name="tab.value"
      :to="tab.route"
      :icon="tab.icon"
      :label="tab.label"
      class="min-h-[56px]"
    />
  </q-tabs>
</template>

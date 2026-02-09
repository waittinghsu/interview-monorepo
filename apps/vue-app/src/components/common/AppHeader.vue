<script setup>
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}

function onThemeChange(value) {
  themeStore.setTheme(value)
}
</script>

<template>
  <q-header elevated class="bg-sys-background-light">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item v-close-popup clickable to="/">
              <q-item-section>
                <span class="text-primary">首頁</span>
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable to="/about">
              <q-item-section>關於</q-item-section>
            </q-item>
            <q-item v-close-popup clickable to="/seat-grid">
              <q-item-section>SeatGrid</q-item-section>
            </q-item>
            <q-item v-close-popup clickable to="/seat-rotate">
              <q-item-section>SeatRotate</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-toolbar-title>
        <router-link :to="{ name: 'Home' }" class="text-primary-400 no-underline">
          Interview Vue
        </router-link>
      </q-toolbar-title>

      <q-space />

      <!-- 主題切換 -->
      <q-select
        :model-value="themeStore.currentThemeName"
        :options="themeStore.themeOptions"
        dense
        outlined
        emit-value
        map-options
        dark
        class="mr-4"
        style="min-width: 120px"
        @update:model-value="onThemeChange"
      >
        <template #prepend>
          <q-icon name="palette" size="xs" />
        </template>
      </q-select>

      <template v-if="userStore.isLoggedIn">
        <span class="mr-4">{{ userStore.user?.name }}</span>
        <q-btn flat label="登出" @click="handleLogout" />
      </template>
      <template v-else>
        <q-btn flat label="登入" to="/login" />
      </template>
    </q-toolbar>
  </q-header>
</template>

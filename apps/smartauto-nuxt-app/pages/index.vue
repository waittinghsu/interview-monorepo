<script setup lang="ts">
const sentinel = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const users: string[] = ['waittinghsu', 'yyx990803']
const open = ref(false)
const showUser = ref<string>('waittinghsu')

const { repos, hasMore, error, loadMore } = useGithubRepos(showUser)

const avatar = computed(() => {
  return `https://github.com/${showUser.value}.png`
})

async function handleSwitchUser(name: string) {
  showUser.value = name
  open.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await nextTick()
  if (repos.value.length === 0) {
    await loadMore()
  }
}

onClickOutside(dropdown, () => open.value = false)

let observer: IntersectionObserver | null = null
onMounted(() => {
  loadMore()
  // 建立 observer
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting)
      loadMore()
  })

  // 開始觀察 sentinel
  if (sentinel.value)
    observer.observe(sentinel.value)

  // document.addEventListener('click', (e) => {
  //   if (!dropdown.value?.contains(e.target as Node)) {
  //     open.value = false
  //   }
  // })
})
// 元件銷毀時清除
onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0e27]">
    <!-- Header -->
    <header class="bg-[#12182e] border-b-solid border-[#12182e] sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3 relative">
          <img
            :src="avatar"
            alt="yyx990803"
            class="w-10 h-10 rounded-full"
            @click="open = !open"
          >
          <div v-show="open" ref="dropdown" class="absolute top-full left-0 mt-1 w-64 bg-gray-100 rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
            <div v-for="user in users" :key="user" class="px-4 py-2.5 hover:bg-gray-300 cursor-pointer" @click="handleSwitchUser(user)">
              選項 {{ user }}
            </div>
          </div>
          <div>
            <h1 class="text-lg font-bold text-[#6ee7b7]">
              {{ showUser }} 的 GitHub Repos hasMore:{{ hasMore }}
            </h1>
            <p class="text-xs text-gray-300">
              測試無限滾動載入
            </p>
            <p class="text-lg text-red-500">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Repo List -->
    <main class="max-w-3xl mx-auto px-4 py-6">
      <div class="flex flex-col gap-3">
        <RepoCard
          v-for="(repo, index) in repos"
          :key="`${showUser}-${repo.id}-${index}`"
          :repo="repo"
        />
      </div>

      <!-- End of List -->
      <div
        v-if="!hasMore && repos.length > 0"
        class="mt-6 text-center text-gray-400 text-sm py-4"
      >
        已顯示全部 {{ repos.length }} 個 repos
      </div>

      <!-- Sentinel -->
      <div ref="sentinel" class="h-1" />
    </main>
  </div>
</template>

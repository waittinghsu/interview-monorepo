<script setup lang="ts">
const { repos, loading, hasMore, error, loadMore } = useGithubRepos()
const sentinel = ref<HTMLElement | null>(null)

onMounted(() => loadMore())

useIntersectionObserver(sentinel, ([entry]) => {
  console.log('Intersection detected:', entry)
  if (entry?.isIntersecting)
    loadMore()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center gap-3">
          <img
            src="https://github.com/yyx990803.png"
            alt="yyx990803"
            class="w-10 h-10 rounded-full"
          >
          <div>
            <h1 class="text-lg font-bold text-gray-900">
              yyx990803（Evan You）的 GitHub Repos
            </h1>
            <p class="text-xs text-gray-500">
              Vue.js 作者 · 無限滾動載入
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Repo List -->
    <main class="max-w-3xl mx-auto px-4 py-6">
      <div class="flex flex-col gap-3">
        <RepoCard
          v-for="repo in repos"
          :key="repo.id"
          :repo="repo"
        />
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="mt-6 text-center text-red-500 text-sm"
      >
        {{ error }}
        <button
          class="ml-2 underline text-blue-500 cursor-pointer"
          @click="loadMore"
        >
          重試
        </button>
      </div>

      <!-- Loading Spinner -->
      <div
        v-if="loading"
        class="mt-6 flex justify-center"
      >
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

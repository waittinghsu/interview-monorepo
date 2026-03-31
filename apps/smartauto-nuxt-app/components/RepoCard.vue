<script setup lang="ts">
import type { GithubRepo } from '~/types/github'

defineProps<{
  repo: GithubRepo
}>()
</script>

<template>
  <!--  :href="repo.html_url" transition-all duration-300 -->
  <a
    target="_blank"
    rel="noopener noreferrer"
    class="block bg-[#12182e] rounded-xl border-solid border-[#1a2140] p-5 hover:border-[#6ee7b7] hover:shadow-md hover:scale-103 transition-all duration-300 no-underline cursor-pointer"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-base font-semibold text-[#22d3ee] hover:text-blue-700 truncate">
        {{ repo?.name || 'waittinghsu' }}
      </h3>
      <div class="flex items-center gap-1 text-amber-500 text-sm shrink-0">
        <span>★</span>
        <span>{{ repo?.stargazers_count.toLocaleString() }}</span>
      </div>
    </div>

    <p class="mt-2 text-sm text-gray-500 line-clamp-2 min-h-10">
      {{ repo?.description || '（無說明）' }}
    </p>
    <div>
      <a class="text-[#fcd34d]" :href="repo.html_url" target="_blank">{{ repo.html_url }}</a>
    </div>
    <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
      <div class="flex items-center gap-3">
        <span v-if="repo.language" class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
          {{ repo?.language }}
        </span>
        <span v-if="repo.updated_at">更新於 {{ new Date(repo.updated_at).toLocaleDateString('zh-TW') }}</span>
      </div>
      <span>{{ repo?.id }}</span>
    </div>
  </a>
</template>

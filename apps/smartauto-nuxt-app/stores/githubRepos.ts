import type { GithubRepo } from '~/types/github'

interface UserReposState {
  repos: GithubRepo[]
  idSet: Set<number>
  page: number
  hasMore: boolean
  loading: boolean
  error: string | null
}

export const useGithubReposStore = defineStore('githubRepos', () => {
  // key用 username
  const cache = ref<Record<string, UserReposState>>({})

  function getOrInit(username: string): UserReposState {
    if (!cache.value[username]) {
      cache.value[username] = {
        repos: [],
        idSet: new Set(),
        page: 1,
        hasMore: true,
        loading: false,
        error: null,
      }
    }
    return cache.value[username] as UserReposState
  }

  return { cache, getOrInit }
})

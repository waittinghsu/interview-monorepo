import { defineStore } from 'pinia'

/**
 * App Store
 * 管理應用程式全局狀態
 */
export const useAppStore = defineStore('app', () => {
  const gitHubMock = reactive(
    Array.from({ length: 200 }).map((_, index) => {
      return {
        id: index,
        node_id: `MDEwOlJlcG9zaXRvcnkxNjQyNTEwNDA=${index}`,
        name: `build-your-own-${index}`,
        full_name: 'waittingshu/build-your-own-mint',
        html_url: 'https://github.com/waittingshu/build-your-own-mint',
        description: 'Build your own personal finance analytics using Plaid, Google Sheets and CircleCI.',
        fork: false,
        url: 'https://api.github.com/repos/waittingshu/build-your-own-mint',
        created_at: '2019-01-05T21:03:59Z',
        updated_at: '2026-03-13T14:44:11Z',
        pushed_at: '2022-12-10T01:14:18Z',
        git_url: 'git://github.com/waittingshu/build-your-own-mint.git',
        homepage: null,
        size: 91,
        stargazers_count: 2533,
        language: 'HTML',
        visibility: 'public',
        forks: 204,
        open_issues: 11,
        watchers: 2533,
        default_branch: 'master',
      }
    }),
  )

  return {
    gitHubMock,
  }
})

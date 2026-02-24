import { blueNavyTheme, cyberpunkTheme, darkGreenTheme, darkRedTheme, quasarLightTheme } from '@interview/shared-design-tokens'
import { defineStore } from 'pinia'

interface Theme {
  name: string
  description?: string
  colors?: Record<string, string>
  fontFamily?: Record<string, string[]>
  shortcuts?: Array<[string, string]> | Record<string, string>
  // eslint-disable-next-line ts/no-unsafe-function-type
  rules?: Array<[string, string | Record<string, string>] | [RegExp, Function]>
}

/**
 * 主題 Store
 * 管理動態主題切換
 */
export const useThemeStore = defineStore('theme', () => {
  // 可用主題列表
  const themes: Record<string, Theme> = {
    'dark-green': darkGreenTheme,
    'dark-red': darkRedTheme,
    'blue-navy': blueNavyTheme,
    'cyberpunk': cyberpunkTheme,
    'quasar-light': quasarLightTheme,
  }

  // 當前主題名稱
  const currentThemeName = ref<string>('cyberpunk')

  // 當前主題物件
  const currentTheme = computed(() => themes[currentThemeName.value] || themes.cyberpunk)

  // 主題選項（用於下拉選單）
  const themeOptions = computed(() => [
    { label: 'Quasar 亮色', value: 'quasar-light' },
    { label: 'Cyberpunk 暗色', value: 'cyberpunk' },
    { label: '深綠主題', value: 'dark-green' },
    { label: '深紅主題', value: 'dark-red' },
    { label: '深藍主題', value: 'blue-navy' },
  ])

  // 套用 CSS 變數到 :root
  function applyTheme(themeName: string) {
    const theme = themes[themeName]
    if (!theme)
      return

    // 確保在客戶端執行
    if (import.meta.client) {
      const root = document.documentElement
      const colors = theme.colors || {}

      // 套用所有顏色為 CSS 變數
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })

      // 同步更新 Quasar CSS 變數（使用新 token 名稱）
      if (colors.action)
        root.style.setProperty('--q-primary', colors.action)
      if (colors['secondary-500'])
        root.style.setProperty('--q-secondary', colors['secondary-500'])
      if (colors.success)
        root.style.setProperty('--q-positive', colors.success)
      if (colors.warning)
        root.style.setProperty('--q-warning', colors.warning)
      if (colors.error)
        root.style.setProperty('--q-negative', colors.error)
      if (colors.info)
        root.style.setProperty('--q-info', colors.info)
      if (colors['sys-page'])
        root.style.setProperty('--q-dark', colors['sys-page'])

      // 更新 body 背景色與文字色
      if (colors['sys-page'])
        document.body.style.backgroundColor = colors['sys-page']
      if (colors.textBase)
        document.body.style.color = colors.textBase

      // 🌓 自動設置 Quasar Dark Mode
      // 判斷是否為暗色主題（除了 quasar-light 都是暗色）
      const isDarkTheme = themeName !== 'quasar-light'
      const { $q } = useNuxtApp()
      if ($q?.dark) {
        $q.dark.set(isDarkTheme)
      }
    }
  }

  // 切換主題
  function setTheme(themeName: string) {
    if (!themes[themeName])
      return

    currentThemeName.value = themeName

    if (import.meta.client) {
      localStorage.setItem('theme', themeName)
    }

    applyTheme(themeName)
  }

  // 初始化主題
  function initTheme() {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && themes[savedTheme]) {
        currentThemeName.value = savedTheme
      }
    }
    applyTheme(currentThemeName.value)
  }

  return {
    themes,
    currentThemeName,
    currentTheme,
    themeOptions,
    setTheme,
    initTheme,
  }
})

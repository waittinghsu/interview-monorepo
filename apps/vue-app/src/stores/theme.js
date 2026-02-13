import { blueNavyTheme, darkGreenTheme, darkRedTheme } from '@interview/shared-design-tokens'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 主題 Store
 * 管理動態主題切換
 */
export const useThemeStore = defineStore('theme', () => {
  // 可用主題列表
  const themes = {
    'dark-green': darkGreenTheme,
    'dark-red': darkRedTheme,
    'blue-navy': blueNavyTheme,
  }

  // 當前主題名稱
  const currentThemeName = ref(localStorage.getItem('theme') || 'dark-green')

  // 當前主題物件
  const currentTheme = computed(() => themes[currentThemeName.value] || themes['dark-green'])

  // 主題選項（用於下拉選單）
  const themeOptions = computed(() => [
    { label: '深綠主題', value: 'dark-green' },
    { label: '深紅主題', value: 'dark-red' },
    { label: '深藍主題', value: 'blue-navy' },
  ])

  // 套用 CSS 變數到 :root
  function applyTheme(themeName) {
    const theme = themes[themeName]
    if (!theme)
      return

    const root = document.documentElement
    const colors = theme.colors || {}

    // 套用所有顏色為 CSS 變數
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // 同步更新 Quasar CSS 變數
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

    // 更新 body 背景色
    if (colors['sys-page']) {
      document.body.style.backgroundColor = colors['sys-page']
    }
    if (colors.textBase) {
      document.body.style.color = colors.textBase
    }
  }

  // 切換主題
  function setTheme(themeName) {
    if (!themes[themeName])
      return

    currentThemeName.value = themeName
    localStorage.setItem('theme', themeName)
    applyTheme(themeName)
  }

  // 初始化主題
  function initTheme() {
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

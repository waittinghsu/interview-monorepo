import { cyberpunkTheme } from '@interview/shared-design-tokens'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  function applyTheme(theme) {
    const root = document.documentElement
    const colors = theme.colors || {}

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

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

    if (colors['sys-page'])
      document.body.style.backgroundColor = colors['sys-page']
    if (colors.textBase)
      document.body.style.color = colors.textBase
  }

  function initTheme() {
    localStorage.removeItem('theme')
    applyTheme(cyberpunkTheme)
  }

  return { initTheme }
})

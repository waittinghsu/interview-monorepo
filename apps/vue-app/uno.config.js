import {
  blueNavyTheme,
  darkGreenTheme,
  darkRedTheme,
  defaultTheme,
} from '@interview/shared-design-tokens'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// 合併所有主題的 shortcuts 和 rules
const allThemes = [darkGreenTheme, darkRedTheme, blueNavyTheme]
const mergedShortcuts = allThemes.flatMap(t => t.shortcuts ?? [])
const mergedRules = allThemes.flatMap(t => t.rules ?? [])

// 將顏色轉換為 CSS 變數格式
function colorsToVars(colors) {
  const result = {}
  Object.keys(colors).forEach((key) => {
    result[key] = `var(--color-${key})`
  })
  return result
}

// 生成 CSS 變數預設值
function generateCssVars(colors) {
  return Object.entries(colors)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join('\n      ')
}

// 生成 Quasar CSS 變數
function generateQuasarVars(colors) {
  const mapping = {
    'primary': '--q-primary',
    'secondary': '--q-secondary',
    'success': '--q-positive',
    'warning': '--q-warning',
    'error': '--q-negative',
    'info': '--q-info',
    'sys-background': '--q-dark',
  }
  return Object.entries(mapping)
    .filter(([key]) => colors[key])
    .map(([key, varName]) => `${varName}: ${colors[key]};`)
    .join('\n      ')
}

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],

  // Design Token: 預設 CSS 變數（讓顏色在頁面載入時就有預設值）
  preflights: [
    {
      getCSS: () => `
        :root {
          ${generateCssVars(defaultTheme.colors ?? {})}
          ${generateQuasarVars(defaultTheme.colors ?? {})}
        }
      `,
    },
  ],

  // Design Token: 使用 CSS 變數實現動態主題
  theme: {
    colors: colorsToVars(defaultTheme.colors ?? {}),
    fontFamily: defaultTheme.fontFamily ?? {},
  },

  // Design Token: 快捷類（合併所有主題）
  shortcuts: [
    // 基礎快捷類
    { 'flex-center': 'flex items-center justify-center' },
    { 'flex-between': 'flex items-center justify-between' },
    // 主題快捷類
    ...mergedShortcuts,
  ],

  // Design Token: 自訂規則（合併所有主題）
  rules: [
    ...mergedRules,
  ],
})

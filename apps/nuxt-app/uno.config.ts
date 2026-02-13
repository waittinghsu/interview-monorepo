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
const mergedShortcuts = allThemes.flatMap((t: any) => t.shortcuts ?? [])
const mergedRules = allThemes.flatMap((t: any) => t.rules ?? [])

// 將顏色轉換為 CSS 變數格式
function colorsToVars(colors: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  Object.keys(colors).forEach((key) => {
    result[key] = `var(--color-${key})`
  })
  return result
}

// 生成 CSS 變數預設值
function generateCssVars(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join('\n      ')
}

// 生成 Quasar CSS 變數
function generateQuasarVars(colors: Record<string, string>): string {
  const mapping: Record<string, string> = {
    'action': '--q-primary',
    'secondary-500': '--q-secondary',
    'success': '--q-positive',
    'warning': '--q-warning',
    'error': '--q-negative',
    'info': '--q-info',
    'sys-page': '--q-dark',
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

  // Design Token: 預設 CSS 變數
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

  // Design Token: 快捷類
  shortcuts: [
    { 'flex-center': 'flex items-center justify-center' },
    { 'flex-between': 'flex items-center justify-between' },
    // 漸層按鈕（隨主題切換）
    { 'btn-gradient-base': 'text-white font-semibold rounded-lg px-6 py-3 cursor-pointer transition-all hover:opacity-90 active:scale-95 border-none' },
    { 'btn-gradient-primary': 'btn-gradient-base [background:linear-gradient(to_bottom_right,var(--color-action),var(--color-secondary-500))]' },
    { 'btn-gradient-success': 'btn-gradient-base [background:linear-gradient(to_bottom_right,var(--color-successLight),var(--color-successDark))]' },
    { 'btn-gradient-warning': 'btn-gradient-base [background:linear-gradient(to_bottom_right,var(--color-warningLight),var(--color-warningDark))]' },
    { 'btn-gradient-error': 'btn-gradient-base [background:linear-gradient(to_bottom_right,var(--color-errorLight),var(--color-errorDark))]' },
    { 'btn-gradient-info': 'btn-gradient-base [background:linear-gradient(to_bottom_right,var(--color-infoLight),var(--color-infoDark))]' },
    ...mergedShortcuts,
  ],

  // Design Token: 自訂規則
  rules: [
    ...mergedRules,
  ],
})

import { defineTheme } from './types.js'

/**
 * Blue Navy Theme (深藍主題)
 *
 * 參考來源：makenewworld/jiefu
 * 風格：深藍暗色主題
 */
export default defineTheme({
  name: 'blue-navy',
  description: '深藍暗色主題',

  // 顏色系統
  colors: {
    // 品牌主色 - 藍色系
    'primary': '#1181FE',
    'primaryLight': '#41B3FF',
    'primaryDark': '#07121E',

    // 完整 Primary 色階 (50-950)
    'primary-50': '#41B3FF',
    'primary-100': '#3FA4FC',
    'primary-200': '#AAC0D2',
    'primary-300': '#878787',
    'primary-400': '#0175FF',
    'primary-500': '#1181FE', // 主色
    'primary-600': '#005B98',
    'primary-700': '#1A2E43',
    'primary-800': '#263343',
    'primary-900': '#0F1B27',
    'primary-950': '#07121E', // 最深（背景色）
    'primary-1000': '#06101C',

    // 次要色 - 橘黃色系
    'secondary': '#FF9D13',
    'secondaryLight': '#FFA900',
    'secondaryDark': '#FDFDE5',

    'secondary-50': '#878787',
    'secondary-100': '#FEEF87',
    'secondary-200': '#FEEF87',
    'secondary-300': '#878787',
    'secondary-400': '#FFA900',
    'secondary-500': '#FF9D13', // 次色
    'secondary-600': '#878787',
    'secondary-700': '#878787',
    'secondary-800': '#878787',
    'secondary-900': '#878787',
    'secondary-950': '#878787',

    // 強調色
    'accent': '#878787',

    // 語義化顏色
    'success': '#27C017',
    'success-light': '#3EE17F',
    'success-dark': '#1A8050',

    'warning': '#FF9D13',
    'warning-light': '#FFA900',
    'warning-dark': '#CC7A00',

    'error': '#CA2C2F',
    'error-light': '#E74C3C',
    'error-dark': '#A02325',

    'info': '#1181FE',
    'info-light': '#41B3FF',
    'info-dark': '#005B98',

    // 系統顏色
    'sys-background': '#07121E',
    'sys-background-light': '#0F1B27',
    'sys-background-dark': '#06101C',
    'sys-background-tab': '#0F1B27',
    'sys-background-table': '#1A2E43',
    'sys-background-popup': '#0C2136',
    'sys-background-popup-100': '#0C3259',
    'sys-surface': '#0F1B27',
    'sys-surface-light': '#1A2E43',
    'sys-border': '#5B6977',
    'sys-border-light': '#1181FE',
    'sys-tab-text': '#AAC0D2',

    // 背景/表面（別名）
    'background': '#07121E',
    'surface': '#0F1B27',
    'border': '#5B6977',

    // 文字顏色
    'textPrimary': '#AAC0D2',
    'textSecondary': '#5B6977',
    'textMuted': '#AAC0D2',
    'textInverse': '#07121E',
  },

  // 字體配置
  fontFamily: {
    sans: ['Bai Jamjuree', 'Inter', 'Noto Sans TC', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Noto Serif TC', 'serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  },

  // UnoCSS 快捷類
  shortcuts: [
    // 按鈕樣式
    ['btn-primary', 'bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-400 active:scale-95 transition-all'],
    ['btn-secondary', 'bg-secondary text-sys-background font-semibold px-4 py-2 rounded-lg hover:bg-secondary-400 active:scale-95 transition-all'],
    ['btn-outline', 'border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white active:scale-95 transition-all'],
    ['btn-ghost', 'text-primary px-4 py-2 rounded-lg hover:bg-primary-900 active:scale-95 transition-all'],

    // 卡片樣式
    ['card-base', 'bg-sys-surface rounded-lg border border-sys-border'],
    ['card-elevated', 'bg-sys-surface rounded-lg shadow-lg shadow-primary-950/50'],

    // 文字樣式
    ['text-heading', 'text-textPrimary font-bold'],
    ['text-body', 'text-textSecondary'],
    ['text-muted', 'text-textMuted'],

    // 輸入框樣式
    ['input-base', 'bg-sys-background border border-sys-border text-textPrimary rounded-lg px-3 py-2 focus:border-primary focus:outline-none'],
  ],

  // UnoCSS 規則
  rules: [
    // 背景漸層
    ['bg-gradient-primary', {
      background: 'linear-gradient(135deg, #07121E, #0F1B27, #1181FE)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #0F1B27, #07121E)',
    }],
    ['bg-gradient-blue-dark', {
      background: 'linear-gradient(135deg, #263343, #1181FE, #41B3FF)',
    }],

    // 文字漸層
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #1181FE, #41B3FF)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['text-gradient-blue', {
      'background': 'linear-gradient(135deg, #1181FE, #41B3FF)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],

    // 發光效果
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(17, 129, 254, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(17, 129, 254, 0.5)',
    }],
  ],
})
import { defineTheme } from './types.js'

/**
 * Dark Green Theme
 *
 * 適用於：Interview Vue 面試練習專案
 * 風格：深綠色暗色主題
 */
export default defineTheme({
  name: 'dark-green',
  description: '深綠暗色主題 - Interview Vue',

  // 顏色系統
  colors: {
    // 品牌主色 - 綠色系
    'primary': '#00da9b',
    'primaryLight': '#00ffb8',
    'primaryDark': '#00a876',

    // 完整 Primary 色階 (50-950)
    'primary-50': '#e6fff6',
    'primary-100': '#b3ffe5',
    'primary-200': '#80ffd4',
    'primary-300': '#4dffc3',
    'primary-400': '#1affb2',
    'primary-500': '#00da9b', // 主色
    'primary-600': '#00a876',
    'primary-700': '#007a56',
    'primary-800': '#004d36',
    'primary-900': '#002f21',
    'primary-950': '#011e16', // 最深（背景色）

    // 次要色 - 金黃色系
    'secondary': '#ffd139',
    'secondaryLight': '#ffe282',
    'secondaryDark': '#e6b800',

    'secondary-50': '#fffbef',
    'secondary-100': '#fff8df',
    'secondary-200': '#ffefbe',
    'secondary-300': '#ffe59d',
    'secondary-400': '#ffdb7b',
    'secondary-500': '#ffd139', // 次色
    'secondary-600': '#ffc400',
    'secondary-700': '#e6aa00',
    'secondary-800': '#cc8800',
    'secondary-900': '#a36300',

    // 語義化顏色
    'success': '#2ad07e',
    'success-light': '#54bd20',
    'success-dark': '#1a8050',

    'warning': '#ff9800',
    'warning-light': '#ffb347',
    'warning-dark': '#f26705',

    'error': '#f01c0c',
    'error-light': '#ff8275',
    'error-dark': '#ca2c2f',

    'info': '#31ccec',
    'info-light': '#7de3f4',
    'info-dark': '#1a9cb8',

    // 系統顏色
    'sys-background': '#011e16',
    'sys-background-light': '#012f21',
    'sys-background-dark': '#001a12',
    'sys-surface': '#012f21',
    'sys-surface-light': '#014030',
    'sys-border': '#00a876',
    'sys-border-light': '#00da9b',

    // 文字顏色
    'textPrimary': '#00da9b',
    'textSecondary': '#00a876',
    'textMuted': '#007a56',
    'textInverse': '#011e16',
  },

  // 字體配置
  fontFamily: {
    sans: ['Inter', 'Noto Sans TC', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Noto Serif TC', 'serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  },

  // UnoCSS 快捷類
  shortcuts: [
    // 按鈕樣式
    ['btn-primary', 'bg-primary text-sys-background font-semibold px-4 py-2 rounded-lg hover:bg-primary-400 active:scale-95 transition-all'],
    ['btn-secondary', 'bg-secondary text-sys-background font-semibold px-4 py-2 rounded-lg hover:bg-secondary-400 active:scale-95 transition-all'],
    ['btn-outline', 'border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-sys-background active:scale-95 transition-all'],
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
      background: 'linear-gradient(135deg, #011e16, #012f21, #00a876)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #012f21, #011e16)',
    }],

    // 文字漸層
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #00da9b, #00ffb8)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],

    // 發光效果
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(0, 218, 155, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(0, 218, 155, 0.5)',
    }],
  ],
})
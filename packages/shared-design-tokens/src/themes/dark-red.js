import { defineTheme } from './types.js'

/**
 * Dark Red Theme (深紅主題)
 *
 * 參考來源：101client design-token
 * 風格：深紅暗色主題
 */
export default defineTheme({
  name: 'dark-red',
  description: '深紅暗色主題',

  // 顏色系統
  colors: {
    // 品牌主色 - 紅色系
    'primary': '#751514',
    'primaryLight': '#E32724',
    'primaryDark': '#420C0C',

    // 完整 Primary 色階 (50-900)
    'primary-50': '#FFAEAA',
    'primary-100': '#FF8275',
    'primary-200': '#F01C0C',
    'primary-300': '#E32724',
    'primary-400': '#A61F1F',
    'primary-500': '#751514', // 主色
    'primary-600': '#680F10',
    'primary-700': '#560F0F',
    'primary-800': '#420C0C',
    'primary-900': '#260A0C',
    'primary-950': '#1A0808', // 最深（背景色）

    // 次要色 - 金黃色系
    'secondary': '#FFD139',
    'secondaryLight': '#FFE282',
    'secondaryDark': '#E6B800',

    'secondary-50': '#FFFBEF',
    'secondary-100': '#FFF8DF',
    'secondary-150': '#FFED00',
    'secondary-200': '#FFEFBE',
    'secondary-250': '#FF8D00',
    'secondary-300': '#FFE59D',
    'secondary-400': '#FFDB7B',
    'secondary-500': '#FFD139', // 次色
    'secondary-600': '#FFC400',
    'secondary-700': '#E6AA00',
    'secondary-800': '#CC8800',
    'secondary-900': '#A36300',

    // 語義化顏色
    'success': '#2AD07E',
    'success-50': '#BCF25E',
    'success-100': '#44fa1d',
    'success-200': '#85DB3A',
    'success-300': '#54BD20',

    'warning': '#FF9800',
    'warning-50': '#FFF4E0',
    'warning-100': '#FCAC4A',
    'warning-200': '#FDB55B',
    'warning-300': '#FFB347',
    'warning-400': '#FFA521',
    'warning-500': '#FF9800',
    'warning-600': '#F97F00',
    'warning-700': '#F26705',
    'warning-800': '#EB4E0D',
    'warning-900': '#F15710',

    'error': '#F01C0C',
    'error-light': '#FF8275',
    'error-dark': '#751514',

    'info': '#31CCEC',
    'info-light': '#7DE3F4',
    'info-dark': '#1A9CB8',

    'positive': '#2AD07E',
    'negative': '#F01C0C',

    // 中性色
    'neutral-300': '#BA9396',

    // 系統顏色
    'sys-background': '#260A0C',
    'sys-background-light': '#420C0C',
    'sys-background-dark': '#1A0808',
    'sys-surface': '#420C0C',
    'sys-surface-light': '#560F0F',
    'sys-border': '#751514',
    'sys-border-light': '#A61F1F',

    // 文字顏色
    'textPrimary': '#FFAEAA',
    'textSecondary': '#FF8275',
    'textMuted': '#BA9396',
    'textInverse': '#260A0C',
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
    ['btn-primary', 'bg-primary-300 text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-200 active:scale-95 transition-all'],
    ['btn-secondary', 'bg-secondary text-sys-background font-semibold px-4 py-2 rounded-lg hover:bg-secondary-400 active:scale-95 transition-all'],
    ['btn-outline', 'border border-primary-300 text-primary-300 px-4 py-2 rounded-lg hover:bg-primary-300 hover:text-white active:scale-95 transition-all'],
    ['btn-ghost', 'text-primary-300 px-4 py-2 rounded-lg hover:bg-primary-900 active:scale-95 transition-all'],

    // 卡片樣式
    ['card-base', 'bg-sys-surface rounded-lg border border-sys-border'],
    ['card-elevated', 'bg-sys-surface rounded-lg shadow-lg shadow-primary-950/50'],

    // 文字樣式
    ['text-heading', 'text-textPrimary font-bold'],
    ['text-body', 'text-textSecondary'],
    ['text-muted', 'text-textMuted'],

    // 輸入框樣式
    ['input-base', 'bg-sys-background border border-sys-border text-textPrimary rounded-lg px-3 py-2 focus:border-primary-300 focus:outline-none'],
  ],

  // UnoCSS 規則
  rules: [
    // 背景漸層
    ['bg-gradient-primary', {
      background: 'linear-gradient(135deg, #260A0C, #420C0C, #751514)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #420C0C, #260A0C)',
    }],
    ['bg-gradient-fire', {
      background: 'linear-gradient(135deg, #751514, #E32724, #FFD139)',
    }],

    // 文字漸層
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #E32724, #FF8275)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['text-gradient-gold', {
      'background': 'linear-gradient(135deg, #FFD139, #FFE282)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],

    // 發光效果
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(227, 39, 36, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(227, 39, 36, 0.5)',
    }],
    ['glow-gold', {
      'box-shadow': '0 0 20px rgba(255, 209, 57, 0.3)',
    }],
  ],
})
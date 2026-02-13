import { defineTheme } from './types.js'

/**
 * Dark Green Theme
 *
 * 適用於：Interview Vue 面試練習專案
 * 風格：深綠色暗色主題
 *
 * Token 結構：
 *   Primitive  → primary-50 ~ primary-950 / secondary-50 ~ secondary-900
 *   Semantic   → sys-* (背景/邊框) / text* (文字) / action* (互動)
 */
export default defineTheme({
  name: 'dark-green',
  description: '深綠暗色主題 - Interview Vue',

  colors: {
    // =========================================================
    // Primitive — 原始色階（不帶語意，僅作為數值參照）
    // =========================================================

    // Primary 色階：翠綠，50=最淺 / 950=最深
    'primary-50': '#e6fff6',
    'primary-100': '#b3ffe5',
    'primary-200': '#80ffd4',
    'primary-300': '#4dffc3',
    'primary-400': '#1affb2',
    'primary-500': '#00da9b',
    'primary-600': '#00a876',
    'primary-700': '#007a56',
    'primary-800': '#004d36',
    'primary-900': '#002f21',
    'primary-950': '#011e16',

    // Secondary 色階：金黃，配合深綠形成對比
    'secondary-50': '#fffbef',
    'secondary-100': '#fff8df',
    'secondary-200': '#ffefbe',
    'secondary-300': '#ffe59d',
    'secondary-400': '#ffdb7b',
    'secondary-500': '#ffd139',
    'secondary-600': '#ffc400',
    'secondary-700': '#e6aa00',
    'secondary-800': '#cc8800',
    'secondary-900': '#a36300',

    // =========================================================
    // Semantic — 語意化 Surface（背景層次）
    // =========================================================
    // 使用 sys- 前綴，對應 UnoCSS class: bg-sys-page / bg-sys-card / bg-sys-raised
    'sys-page':   '#011e16', // 最深頁面底色（primary-950）
    'sys-card':   '#012f21', // 卡片 / 區塊背景（primary-900）
    'sys-raised': '#014030', // 懸浮層：dropdown、tooltip（primary-800+）

    // =========================================================
    // Semantic — 語意化 Border（邊框）
    // =========================================================
    'sys-border':        '#00a876', // 一般/細邊框（primary-600）
    'sys-border-strong': '#00da9b', // 強調邊框、focus ring（primary-500）

    // =========================================================
    // Semantic — 語意化 Text（文字）
    // camelCase 命名避免 UnoCSS 產生 text-text-X 的雙重前綴
    // =========================================================
    'textBase':      '#e6fff6', // 主要閱讀文字，高對比（primary-50）
    'textSecondary': '#80ffd4', // 次要說明文字（primary-200）
    'textMuted':     '#4dffc3', // placeholder / disabled（primary-300）
    'textBrand':     '#00da9b', // 品牌色強調文字（primary-500）
    'textInverse':   '#011e16', // 放在亮色按鈕上的深色文字（primary-950）

    // =========================================================
    // Semantic — 語意化 Action（互動元素）
    // =========================================================
    'action':        '#00da9b', // 主要 CTA 按鈕背景（primary-500）
    'actionHover':   '#1affb2', // hover 狀態（primary-400）
    'actionActive':  '#00a876', // pressed 狀態（primary-600）

    // =========================================================
    // 狀態色（各主題保持一致語意）
    // =========================================================
    'success':       '#2ad07e',
    'success-light': '#54bd20',
    'success-dark':  '#1a8050',

    'warning':       '#ff9800',
    'warning-light': '#ffb347',
    'warning-dark':  '#f26705',

    'error':         '#f01c0c',
    'error-light':   '#ff8275',
    'error-dark':    '#ca2c2f',

    'info':          '#31ccec',
    'info-light':    '#7de3f4',
    'info-dark':     '#1a9cb8',
  },

  fontFamily: {
    sans: ['Inter', 'Noto Sans TC', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Noto Serif TC', 'serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  },

  shortcuts: [
    // 按鈕
    ['btn-primary',  'bg-action text-textInverse font-semibold px-4 py-2 rounded-lg hover:bg-actionHover active:bg-actionActive active:scale-95 transition-all'],
    ['btn-secondary','bg-secondary-500 text-sys-page font-semibold px-4 py-2 rounded-lg hover:bg-secondary-400 active:scale-95 transition-all'],
    ['btn-outline',  'border border-sys-border-strong text-textBrand px-4 py-2 rounded-lg hover:bg-action hover:text-textInverse active:scale-95 transition-all'],
    ['btn-ghost',    'text-textBrand px-4 py-2 rounded-lg hover:bg-sys-raised active:scale-95 transition-all'],

    // 卡片
    ['card-base',    'bg-sys-card rounded-lg border border-sys-border'],
    ['card-elevated','bg-sys-card rounded-lg shadow-lg shadow-primary-950/50'],

    // 文字
    ['text-heading', 'text-textBase font-bold'],
    ['text-body',    'text-textSecondary'],
    ['text-muted',   'text-textMuted'],

    // 輸入框
    ['input-base',   'bg-sys-page border border-sys-border text-textBase rounded-lg px-3 py-2 focus:border-sys-border-strong focus:outline-none'],
  ],

  rules: [
    ['bg-gradient-primary', {
      background: 'linear-gradient(135deg, #011e16, #012f21, #00a876)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #012f21, #011e16)',
    }],
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #00da9b, #1affb2)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(0, 218, 155, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(0, 218, 155, 0.5)',
    }],
  ],
})

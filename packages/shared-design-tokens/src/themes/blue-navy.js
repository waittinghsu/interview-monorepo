import { defineTheme } from './types.js'

/**
 * Blue Navy Theme
 *
 * 參考來源：makenewworld/jiefu
 * 風格：深藍暗色主題
 *
 * Token 結構：
 *   Primitive  → primary-50 ~ primary-950 / secondary-50 ~ secondary-950
 *   Semantic   → sys-* (背景/邊框) / text* (文字) / action* (互動)
 *
 * 修正：secondary 色階原本全為 #878787，已重新生成正確橘黃色階
 */
export default defineTheme({
  name: 'blue-navy',
  description: '深藍暗色主題',

  colors: {
    // =========================================================
    // Primitive — 原始色階（不帶語意，僅作為數值參照）
    // =========================================================

    // Primary 色階：深藍，50=最淺 / 950=最深
    'primary-50':   '#E8F4FF',
    'primary-100':  '#C0DFFE',
    'primary-200':  '#AAC0D2',
    'primary-300':  '#41B3FF',
    'primary-400':  '#0175FF',
    'primary-500':  '#1181FE',
    'primary-600':  '#005B98',
    'primary-700':  '#1A2E43',
    'primary-800':  '#263343',
    'primary-900':  '#0F1B27',
    'primary-950':  '#07121E',

    // Secondary 色階：橘黃，與深藍形成強對比（修正原本全為灰色的問題）
    'secondary-50':  '#FFF8EF',
    'secondary-100': '#FFEBD4',
    'secondary-200': '#FFD4A0',
    'secondary-300': '#FFBC6B',
    'secondary-400': '#FFAB40',
    'secondary-500': '#FF9D13',
    'secondary-600': '#E08800',
    'secondary-700': '#B86E00',
    'secondary-800': '#8C5300',
    'secondary-900': '#5E3600',
    'secondary-950': '#321C00',

    // =========================================================
    // Semantic — 語意化 Surface（背景層次）
    // =========================================================
    'sys-page':   '#07121E', // 最深頁面底色（primary-950）
    'sys-card':   '#0F1B27', // 卡片 / 區塊背景（primary-900）
    'sys-raised': '#1A2E43', // 懸浮層：dropdown、tooltip（primary-800 區）

    // =========================================================
    // Semantic — 語意化 Border（邊框）
    // =========================================================
    'sys-border':        '#5B6977', // 一般/細邊框（中性藍灰）
    'sys-border-strong': '#1181FE', // 強調邊框、focus ring（primary-500）

    // =========================================================
    // Semantic — 語意化 Text（文字）
    // =========================================================
    'textBase':      '#E8F4FF', // 主要閱讀文字，高對比（primary-50，近白帶藍）
    'textSecondary': '#AAC0D2', // 次要說明文字（primary-200，柔藍灰）
    'textMuted':     '#5B6977', // placeholder / disabled（藍灰，與 sys-border 同色）
    'textBrand':     '#1181FE', // 品牌色強調文字（primary-500）
    'textInverse':   '#07121E', // 放在亮色按鈕上的深色文字（primary-950）

    // =========================================================
    // Semantic — 語意化 Action（互動元素）
    // =========================================================
    'action':       '#1181FE', // 主要 CTA 按鈕背景（primary-500）
    'actionHover':  '#0175FF', // hover 狀態（primary-400，更深藍）
    'actionActive': '#005B98', // pressed 狀態（primary-600）

    // =========================================================
    // 狀態色（各主題保持一致語意）
    // =========================================================
    'success':       '#27C017',
    'success-light': '#3EE17F',
    'success-dark':  '#1A8050',

    'warning':       '#FF9D13',
    'warning-light': '#FFAB40',
    'warning-dark':  '#CC7A00',

    'error':         '#CA2C2F',
    'error-light':   '#E74C3C',
    'error-dark':    '#A02325',

    'info':          '#1181FE',
    'info-light':    '#41B3FF',
    'info-dark':     '#005B98',
  },

  fontFamily: {
    sans: ['Bai Jamjuree', 'Inter', 'Noto Sans TC', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
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
      background: 'linear-gradient(135deg, #07121E, #0F1B27, #1181FE)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #0F1B27, #07121E)',
    }],
    ['bg-gradient-blue-dark', {
      background: 'linear-gradient(135deg, #263343, #1181FE, #41B3FF)',
    }],
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #1181FE, #41B3FF)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(17, 129, 254, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(17, 129, 254, 0.5)',
    }],
  ],
})
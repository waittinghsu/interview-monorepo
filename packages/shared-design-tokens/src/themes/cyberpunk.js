import { defineTheme } from './types.js'

/**
 * Cyberpunk Theme
 *
 * 適用於：Dashboard 頁面
 * 風格：賽博朋克暗色主題，以青藍（cyan）為主色，紫（purple）為輔色
 *
 * Token 結構：
 *   Primitive  → primary-50 ~ primary-950 / secondary-50 ~ secondary-950
 *   Semantic   → sys-* (背景/邊框) / text* (文字) / action* (互動)
 *   Cyberpunk  → cyber-cyan / cyber-purple / cyber-amber / cyber-emerald / cyber-blue / cyber-pink
 */
export default defineTheme({
  name: 'cyberpunk',
  description: '賽博朋克暗色主題 - Dashboard',

  colors: {
    // =========================================================
    // Primitive — 原始色階（不帶語意，僅作為數值參照）
    // =========================================================

    // Primary 色階：青藍（cyan），50=最淺 / 950=最深
    'primary-50':  '#ecfeff',
    'primary-100': '#cffafe',
    'primary-200': '#a5f3fc',
    'primary-300': '#67e8f9',
    'primary-400': '#22d3ee',
    'primary-500': '#06b6d4',
    'primary-600': '#0891b2',
    'primary-700': '#0e7490',
    'primary-800': '#155e75',
    'primary-900': '#164e63',
    'primary-950': '#0a0e27',

    // Secondary 色階：紫（purple），配合青藍形成對比
    'secondary-50':  '#faf5ff',
    'secondary-100': '#f3e8ff',
    'secondary-200': '#e9d5ff',
    'secondary-300': '#d8b4fe',
    'secondary-400': '#c084fc',
    'secondary-500': '#a855f7',
    'secondary-600': '#9333ea',
    'secondary-700': '#7e22ce',
    'secondary-800': '#6b21a8',
    'secondary-900': '#581c87',
    'secondary-950': '#1e0a40',

    // =========================================================
    // Semantic — 語意化 Surface（背景層次）
    // =========================================================
    'sys-page':   '#0a0e27', // 最深頁面底色
    'sys-card':   '#12182e', // 卡片 / 區塊背景
    'sys-raised': '#1a2140', // 懸浮層：dropdown、tooltip

    // =========================================================
    // Semantic — 語意化 Border（邊框）
    // =========================================================
    'sys-border':        '#414c76', // 一般/細邊框（暗藍灰）
    'sys-border-strong': '#22d3ee', // 強調邊框、focus ring（cyan）

    // =========================================================
    // Semantic — 語意化 Text（文字）
    // =========================================================
    'textBase':      '#f0f4ff', // 主要閱讀文字（近白帶藍）
    'textSecondary': '#b0bdd8', // 次要說明文字（柔藍灰）
    'textMuted':     '#6b7899', // placeholder / disabled
    'textBrand':     '#22d3ee', // 品牌色強調文字（cyan-400）
    'textInverse':   '#0a0e27', // 放在亮色按鈕上的深色文字

    // =========================================================
    // Semantic — 語意化 Action（互動元素）
    // =========================================================
    'action':       '#22d3ee', // 主要 CTA 按鈕背景（cyan-400）
    'actionHover':  '#67e8f9', // hover 狀態（cyan-300）
    'actionActive': '#06b6d4', // pressed 狀態（cyan-500）

    // =========================================================
    // Cyberpunk 專屬 Accent 色（對應各面板的多色標記）
    // =========================================================
    'cyber-cyan':    '#67e8f9', // 主要 accent（cyan-300）
    'cyber-purple':  '#d8b4fe', // 次要 accent（purple-300）
    'cyber-amber':   '#fcd34d', // 三級 accent（amber-300）
    'cyber-emerald': '#6ee7b7', // 成功 / 活躍（emerald-300）
    'cyber-blue':    '#93c5fd', // 資訊 / 系統（blue-300）
    'cyber-pink':    '#f9a8d4', // 平台 / 社群（pink-300）

    // =========================================================
    // 狀態色
    // =========================================================
    'success':       '#34d399',
    'success-light': '#6ee7b7',
    'success-dark':  '#059669',

    'warning':       '#fbbf24',
    'warning-light': '#fcd34d',
    'warning-dark':  '#d97706',

    'error':         '#f87171',
    'error-light':   '#fca5a5',
    'error-dark':    '#ef4444',

    'info':          '#22d3ee',
    'info-light':    '#67e8f9',
    'info-dark':     '#0891b2',
  },

  fontFamily: {
    sans: ['Inter', 'Noto Sans TC', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Noto Serif TC', 'serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  },

  shortcuts: [
    // 按鈕
    ['btn-primary',   'bg-action text-textInverse font-semibold px-4 py-2 rounded-lg hover:bg-actionHover active:bg-actionActive active:scale-95 transition-all'],
    ['btn-secondary', 'bg-secondary-500 text-sys-page font-semibold px-4 py-2 rounded-lg hover:bg-secondary-400 active:scale-95 transition-all'],
    ['btn-outline',   'border border-sys-border-strong text-textBrand px-4 py-2 rounded-lg hover:bg-action hover:text-textInverse active:scale-95 transition-all'],
    ['btn-ghost',     'text-textBrand px-4 py-2 rounded-lg hover:bg-sys-raised active:scale-95 transition-all'],

    // 卡片
    ['card-base',     'bg-sys-card rounded-lg border border-sys-border'],
    ['card-elevated', 'bg-sys-card rounded-lg shadow-lg shadow-primary-950/50'],

    // 文字
    ['text-heading',  'text-textBase font-bold'],
    ['text-body',     'text-textSecondary'],
    ['text-muted',    'text-textMuted'],

    // 輸入框
    ['input-base',    'bg-sys-page border border-sys-border text-textBase rounded-lg px-3 py-2 focus:border-sys-border-strong focus:outline-none'],
  ],

  rules: [
    ['bg-gradient-primary', {
      background: 'linear-gradient(135deg, #0a0e27, #12182e, #22d3ee)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #12182e, #0a0e27)',
    }],
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #22d3ee, #67e8f9)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['glow-primary', {
      'box-shadow': '0 0 20px rgba(34, 211, 238, 0.3)',
    }],
    ['glow-primary-strong', {
      'box-shadow': '0 0 30px rgba(34, 211, 238, 0.5)',
    }],
  ],
})
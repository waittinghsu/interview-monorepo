import { defineTheme } from './types.js'

/**
 * Dark Red Theme
 *
 * 參考來源：101client design-token
 * 風格：深紅暗色主題
 *
 * Token 結構：
 *   Primitive  → primary-50 ~ primary-950 / secondary-50 ~ secondary-900
 *   Semantic   → sys-* (背景/邊框) / text* (文字) / action* (互動)
 *
 * 注意：primary-500 (#751514) 是中間深紅，視覺上的「亮紅」為 primary-300 (#E32724)
 *       action 使用 primary-300 以確保足夠的視覺對比
 */
export default defineTheme({
  name: 'dark-red',
  description: '深紅暗色主題',

  colors: {
    // =========================================================
    // Primitive — 原始色階（不帶語意，僅作為數值參照）
    // =========================================================

    // Primary 色階：深紅，50=最淺粉 / 950=最深暗紅
    'primary-50': '#FFAEAA',
    'primary-100': '#FF8275',
    'primary-200': '#F01C0C',
    'primary-300': '#E32724',
    'primary-400': '#A61F1F',
    'primary-500': '#751514',
    'primary-600': '#680F10',
    'primary-700': '#560F0F',
    'primary-800': '#420C0C',
    'primary-900': '#260A0C',
    'primary-950': '#1A0808',

    // Secondary 色階：金黃，與深紅形成高對比
    'secondary-50': '#FFFBEF',
    'secondary-100': '#FFF8DF',
    'secondary-200': '#FFEFBE',
    'secondary-300': '#FFE59D',
    'secondary-400': '#FFDB7B',
    'secondary-500': '#FFD139',
    'secondary-600': '#FFC400',
    'secondary-700': '#E6AA00',
    'secondary-800': '#CC8800',
    'secondary-900': '#A36300',

    // =========================================================
    // Semantic — 語意化 Surface（背景層次）
    // =========================================================
    'sys-page':   '#260A0C', // 最深頁面底色（primary-900）
    'sys-card':   '#420C0C', // 卡片 / 區塊背景（primary-800）
    'sys-raised': '#560F0F', // 懸浮層：dropdown、tooltip（primary-700）

    // =========================================================
    // Semantic — 語意化 Border（邊框）
    // =========================================================
    'sys-border':        '#751514', // 一般/細邊框（primary-500）
    'sys-border-strong': '#A61F1F', // 強調邊框、focus ring（primary-400）

    // =========================================================
    // Semantic — 語意化 Text（文字）
    // =========================================================
    'textBase':      '#FFAEAA', // 主要閱讀文字，高對比（primary-50，粉白）
    'textSecondary': '#BA9396', // 次要說明文字（中性玫瑰灰）
    'textMuted':     '#7A5456', // placeholder / disabled（暗玫瑰灰）
    'textBrand':     '#E32724', // 品牌色強調文字（primary-300，亮紅）
    'textInverse':   '#1A0808', // 放在亮色按鈕上的深色文字（primary-950）

    // =========================================================
    // Semantic — 語意化 Action（互動元素）
    // 使用 primary-300 亮紅而非 primary-500 深紅，確保按鈕有足夠的視覺重量
    // =========================================================
    'action':       '#E32724', // 主要 CTA 按鈕背景（primary-300）
    'actionHover':  '#F01C0C', // hover 狀態（primary-200，更亮）
    'actionActive': '#A61F1F', // pressed 狀態（primary-400，更深）

    // =========================================================
    // 狀態色（各主題保持一致語意）
    // =========================================================
    'success':       '#2AD07E',
    'success-light': '#54BD20',
    'success-dark':  '#1A8050',

    'warning':       '#FF9800',
    'warning-light': '#FFB347',
    'warning-dark':  '#F26705',

    'error':         '#F01C0C',
    'error-light':   '#FF8275',
    'error-dark':    '#751514',

    'info':          '#31CCEC',
    'info-light':    '#7DE3F4',
    'info-dark':     '#1A9CB8',
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
      background: 'linear-gradient(135deg, #260A0C, #420C0C, #751514)',
    }],
    ['bg-gradient-surface', {
      background: 'linear-gradient(180deg, #420C0C, #260A0C)',
    }],
    ['bg-gradient-fire', {
      background: 'linear-gradient(135deg, #751514, #E32724, #FFD139)',
    }],
    ['text-gradient-primary', {
      'background': 'linear-gradient(135deg, #E32724, #FF8275)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
    ['text-gradient-gold', {
      'background': 'linear-gradient(135deg, #FFD139, #FFE59D)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    }],
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
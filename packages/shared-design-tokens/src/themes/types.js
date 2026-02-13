/**
 * Design Token Theme 類型定義
 *
 * Token 分兩層：
 *   Primitive  → primary-50 ~ primary-950 / secondary-50 ~ secondary-950
 *   Semantic   → sys-* (背景/邊框) / text* (文字) / action* (互動)
 *
 * @typedef {Object} ThemeColors
 *
 * -- Primitive: Primary 色階 --
 * @property {string} [primary-50]  - 最淺
 * @property {string} [primary-100]
 * @property {string} [primary-200]
 * @property {string} [primary-300]
 * @property {string} [primary-400]
 * @property {string} [primary-500] - 品牌主色
 * @property {string} [primary-600]
 * @property {string} [primary-700]
 * @property {string} [primary-800]
 * @property {string} [primary-900]
 * @property {string} [primary-950] - 最深（通常作為頁面底色）
 *
 * -- Primitive: Secondary 色階 --
 * @property {string} [secondary-50]
 * @property {string} [secondary-100]
 * @property {string} [secondary-200]
 * @property {string} [secondary-300]
 * @property {string} [secondary-400]
 * @property {string} [secondary-500] - 品牌次色
 * @property {string} [secondary-600]
 * @property {string} [secondary-700]
 * @property {string} [secondary-800]
 * @property {string} [secondary-900]
 * @property {string} [secondary-950]
 *
 * -- Semantic: Surface（背景層次）--
 * @property {string} [sys-page]   - 最深頁面底色
 * @property {string} [sys-card]   - 卡片 / 區塊背景
 * @property {string} [sys-raised] - 懸浮層（dropdown、tooltip）
 *
 * -- Semantic: Border（邊框）--
 * @property {string} [sys-border]        - 一般 / 細邊框
 * @property {string} [sys-border-strong] - 強調邊框、focus ring
 *
 * -- Semantic: Text（文字）--
 * @property {string} [textBase]      - 主要閱讀文字（高對比）
 * @property {string} [textSecondary] - 次要說明文字
 * @property {string} [textMuted]     - placeholder / disabled
 * @property {string} [textBrand]     - 品牌色強調文字
 * @property {string} [textInverse]   - 放在亮色按鈕上的深色文字
 *
 * -- Semantic: Action（互動元素）--
 * @property {string} [action]       - 主要 CTA 按鈕背景
 * @property {string} [actionHover]  - hover 狀態
 * @property {string} [actionActive] - pressed 狀態
 *
 * -- 狀態色 --
 * @property {string} [success]
 * @property {string} [success-light]
 * @property {string} [success-dark]
 * @property {string} [warning]
 * @property {string} [warning-light]
 * @property {string} [warning-dark]
 * @property {string} [error]
 * @property {string} [error-light]
 * @property {string} [error-dark]
 * @property {string} [info]
 * @property {string} [info-light]
 * @property {string} [info-dark]
 */

/**
 * @typedef {Object} ThemeFontFamily
 * @property {string[]} [sans]  - Sans-serif 字體
 * @property {string[]} [serif] - Serif 字體
 * @property {string[]} [mono]  - Monospace 字體
 */

/**
 * UnoCSS rules 支援 string 值或 CSS property object
 * @typedef {Array<[string, string | Record<string, string>] | [RegExp, Function]>} ThemeRules
 */

/**
 * @typedef {Array<[string, string]> | Object<string, string>} ThemeShortcuts
 */

/**
 * Design Token Theme 結構
 *
 * @typedef {Object} Theme
 * @property {string}          name        - 主題名稱（必要）
 * @property {string}          [description] - 主題描述
 * @property {ThemeColors}     [colors]    - 顏色系統
 * @property {ThemeFontFamily} [fontFamily] - 字體配置
 * @property {ThemeShortcuts}  [shortcuts] - UnoCSS 快捷類
 * @property {ThemeRules}      [rules]     - UnoCSS 規則
 */

/**
 * 建立 Theme 的工廠函數
 * @param {Theme} config - 主題配置
 * @returns {Theme}
 */
export function defineTheme(config) {
  return {
    name: config.name,
    description: config.description ?? '',
    colors: config.colors ?? {},
    fontFamily: config.fontFamily ?? {},
    shortcuts: config.shortcuts ?? [],
    rules: config.rules ?? [],
  }
}
/**
 * Design Token Theme 類型定義
 *
 * @typedef {Object} ThemeColors
 * @property {string} [primary] - 主色
 * @property {string} [primaryLight] - 主色亮
 * @property {string} [primaryDark] - 主色暗
 * @property {string} [primary-50] - 主色 50
 * @property {string} [primary-100] - 主色 100
 * @property {string} [primary-200] - 主色 200
 * @property {string} [primary-300] - 主色 300
 * @property {string} [primary-400] - 主色 400
 * @property {string} [primary-500] - 主色 500
 * @property {string} [primary-600] - 主色 600
 * @property {string} [primary-700] - 主色 700
 * @property {string} [primary-800] - 主色 800
 * @property {string} [primary-900] - 主色 900
 * @property {string} [primary-950] - 主色 950
 * @property {string} [secondary] - 次色
 * @property {string} [secondaryLight] - 次色亮
 * @property {string} [secondaryDark] - 次色暗
 * @property {string} [success] - 成功色
 * @property {string} [warning] - 警告色
 * @property {string} [error] - 錯誤色
 * @property {string} [info] - 資訊色
 * @property {string} [background] - 背景色
 * @property {string} [surface] - 表面色
 * @property {string} [border] - 邊框色
 * @property {string} [textPrimary] - 主要文字色
 * @property {string} [textSecondary] - 次要文字色
 */

/**
 * @typedef {Object} ThemeFontFamily
 * @property {string[]} [sans] - Sans-serif 字體
 * @property {string[]} [serif] - Serif 字體
 * @property {string[]} [mono] - Monospace 字體
 */

/**
 * @typedef {Array<[string, string]|[RegExp, Function]>} ThemeRules
 */

/**
 * @typedef {Array<[string, string]>|Object<string, string>} ThemeShortcuts
 */

/**
 * Design Token Theme 結構
 *
 * @typedef {Object} Theme
 * @property {string} name - 主題名稱（必要）
 * @property {string} [description] - 主題描述（可空）
 * @property {ThemeColors} [colors] - 顏色系統（可空）
 * @property {ThemeFontFamily} [fontFamily] - 字體配置（可空）
 * @property {ThemeShortcuts} [shortcuts] - UnoCSS 快捷類（可空）
 * @property {ThemeRules} [rules] - UnoCSS 規則（可空）
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
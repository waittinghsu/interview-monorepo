import { defineTheme } from './types.js'

export default defineTheme({
  name: 'quasar-light',
  description: 'Quasar 官方亮色主題',

  colors: {
    // Primary: Quasar 藍
    'primary-400': '#42A5F5',
    'primary-500': '#1976D2',
    'primary-600': '#1565C0',

    // Secondary: 粉紅/紫
    'secondary-400': '#EC407A',
    'secondary-500': '#E91E63',
    'secondary-600': '#D81B60',

    // Surface
    'sys-page': '#f5f5f5',
    'sys-card': '#ffffff',
    'sys-raised': '#ffffff',

    // Border
    'sys-border': '#e0e0e0',
    'sys-border-strong': '#1976D2',

    // Text
    'textBase': '#212121',
    'textSecondary': '#757575',
    'textMuted': '#9e9e9e',
    'textBrand': '#1976D2',
    'textInverse': '#ffffff',

    // Action
    'action': '#1976D2',
    'actionHover': '#1565C0',
    'actionActive': '#0D47A1',

    // Status
    'success': '#21BA45',
    'warning': '#F2C037',
    'error': '#C10015',
    'info': '#31CCEC',
  },

  shortcuts: [
    ['btn-primary', 'bg-action text-textInverse font-semibold px-4 py-2 rounded-lg hover:bg-actionHover transition-all'],
    ['card-base', 'bg-sys-card rounded-lg border border-sys-border shadow-sm'],
  ],
})

import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  // formatters: {
  //   css: true,
  //   html: true,
  // },

  // 忽略的文件
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/.cache/**',
    '**/.turbo/**',
    '**/docs/**',
    '**/*.md',
    '**/test-hook*.js',
  ],
}, {
  rules: {
    // Console 相關
    'no-console': 'off', // 允許 console.log（開發時有用）

    // TypeScript 相關
    '@typescript-eslint/no-explicit-any': 'warn', // any 類型警告而非錯誤

    // Vue 相關
    'vue/multi-word-component-names': 'off', // 允許單字元件名稱

    // Import 相關
    'unused-imports/no-unused-vars': 'warn', // unused 變數警告而非錯誤

    // 其他
    'no-undef': 'off', // Nuxt auto-imports 會誤報
  },
})

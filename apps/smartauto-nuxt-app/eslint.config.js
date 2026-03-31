import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,

  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/*.md',
  ],
}, {
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'no-undef': 'off',
  },
})

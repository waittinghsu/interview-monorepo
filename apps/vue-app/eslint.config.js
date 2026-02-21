import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  javascript: {
    overrides: {
      'no-console': 'off', // 允許 console（用於埋點 stub、debug）
      'no-unused-vars': 'warn',
    },
  },
  ignores: [
    'dist',
    'node_modules',
    'src/auto-imports.d.ts',
    'src/components.d.ts',
  ],
})

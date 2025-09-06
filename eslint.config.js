import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      '.prettierrc.cjs',
      '*.d.ts',
      'dist/',
      'index.htm',
      'vite.config.ts',
    ],
  },
  // JavaScript 和 TypeScript 通用配置
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-vars': 'off'
    },
  },
  // Vue 文件配置
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 关闭组件名多单词规则
      'vue/max-attributes-per-line': 'error', //每个属性独占一行
      'vue/component-definition-name-casing': 'off', // 关闭组件名大小写规则
      'vue/attributes-order': 'off', 
      'vue/attribute-hyphenation': 'off',
    },
  },
  // Prettier 配置
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          // 在这里你可以覆盖 .prettierrc 中的特定规则
          singleAttributePerLine: true,
        },
      ],
    },
  },
])

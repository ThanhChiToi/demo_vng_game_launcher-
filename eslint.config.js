import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-electron', 'release']),

  // Code chạy trong renderer (React)
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Code chạy trong main process của Electron
  {
    files: ['electron/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Script build thuần CommonJS — không áp rule của typescript-eslint vào đây
  {
    files: ['scripts/**/*.cjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },

  /* ---------------------------------------------------------------------- *
   * Ranh giới kiến trúc.
   * React không có NgModule để chặn import bậy, nên phải ép bằng lint:
   *   app  ->  features  ->  shared/core        (chỉ đi một chiều)
   * ---------------------------------------------------------------------- */
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*', '@/app/**'],
              message: 'features là tầng dưới, không được import ngược lên app/.',
            },
            {
              group: ['@/features/*/*', '@/features/*/**'],
              message:
                'Chỉ được import feature khác qua barrel, ví dụ "@/features/auth" — không chọc thẳng vào thư mục con.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/core/**/*.{ts,tsx}', 'src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*', '@/app/**', '@/features/*', '@/features/**'],
              message:
                'core/ và shared/ là tầng hạ tầng, không được phụ thuộc vào app/ hay features/.',
            },
          ],
        },
      ],
    },
  },
])

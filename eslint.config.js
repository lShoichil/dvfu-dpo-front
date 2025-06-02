import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';
import i18next from 'eslint-plugin-i18next';
import i18n from 'eslint-plugin-i18n';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      i18next: i18next,
      i18n: i18n
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Автосортировка импортов
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react', '^@?\\w'], ['^api', '^stores', '^components'], ['^\\.'], ['^.+\\.s?css$']]
        }
      ],
      'simple-import-sort/exports': 'error',

      // TS-правила
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',

      // JSX
      'react/jsx-wrap-multilines': [
        'error',
        {
          return: 'parens-new-line'
        }
      ],

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  }
);

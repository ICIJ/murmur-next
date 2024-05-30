import tsParser from '@typescript-eslint/parser';
import tsConfigs  from '@typescript-eslint/eslint-plugin';
import vitestPlugin from 'eslint-plugin-vitest';
import storybookPlugin from 'eslint-plugin-storybook';
import icijPlugin from '@icij/eslint-config';


export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['tmpDoc/**/*.stories.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
      },
    },
    plugins: {
      '@typescript-eslint': tsConfigs,
      vitest: vitestPlugin,
      storybook: storybookPlugin,
      icij: icijPlugin,
    },
    rules: {
      ...tsConfigs.configs.recommended.rules,
      ...vitestPlugin.configs.recommended.rules,
      ...storybookPlugin.configs.recommended.rules,
      ...icijPlugin.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      'vitest/no-identical-title': 'error',
      'vitest/expect-expect': 'error',
      "import/no-named-default": "off",
    },
  },
  {
    files: ['*.stories.ts', '*.stories.tsx'],
    rules: {
      'storybook/no-stories-of': 'warn',
      'storybook/prefer-csf': 'warn',
    },
  },
  {
    files: ['*spec.ts', '*spec.tsx'],
    languageOptions: {
      globals: {
        vitest: true,
      },
    },
  },
];

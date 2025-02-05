import tsParser from '@typescript-eslint/parser';
import tsConfigs  from '@typescript-eslint/eslint-plugin';
import vitestPlugin from 'eslint-plugin-vitest';
import storybookPlugin from 'eslint-plugin-storybook';
import icijPlugin from '@icij/eslint-config';


export default [
  {
    files: ['**/*.{ts}'],
    ignores: ['tmpDoc/**/*.stories.{ts}'],
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
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    },
  },
  {
    files: ['*.stories.ts'],
    rules: {
      'storybook/no-stories-of': 'warn',
      'storybook/prefer-csf': 'warn',
    },
  },
  {
    files: ['*spec.ts'],
    languageOptions: {
      globals: {
        vitest: true,
      },
    },
  },
];

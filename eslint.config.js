import globals from "globals"
import icijeslint from "@icij/eslint-config"
import storybook from 'eslint-plugin-storybook'

export default [
  {
    ignores: ["**/*.config.js", "public", ".storybook"]
  },

  // ICIJ ESLint shared config (includes Vue, TypeScript, Stylistic and Vitest)
  ...icijeslint.configs.all,

  // Storybook config
  ...storybook.configs['flat/recommended'],
  {
    files: ['*.stories.ts'],
    rules: {
      'storybook/no-stories-of': 'warn',
      'storybook/prefer-csf': 'warn',
    },
  },

  // Node scripts for common tasks
  {
    files: ["{bin,loaders}/**/*.{cjs,mjs,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },

  // Vitest are written for the browser and must include browser globals
  {
    files: [
      "lib/**/*.{js,vue}",
      "tests/**/*.spec.js",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    }
  },
  
  // Specific rules for the project
  {
    languageOptions: {
      globals: {
        process: true
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      "vue/no-v-html": "off",
    }
  }
]

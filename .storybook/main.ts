import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true
  },
  stories: [
    '../stories/getting-started/installation-guide.mdx',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/preset-scss',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {},
  viteFinal: (config) => {
    return mergeConfig(config, {
      // This is needed because the copy plugin can't copy files outside the root directory
      // The files are copied back to the root by the post script
      build: {
        outDir: 'storybook-static'
      }
    })
  }
}

export default config

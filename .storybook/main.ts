import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true // 👈 Disables telemetry
  },
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    '@storybook/preset-scss',
    '@storybook/addon-themes',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {},
  viteFinal: (config, options) => {
    return mergeConfig(config, {
      // This is needed because the copy plugin can't copy files outside of the root directory
      // The files are copied back to the root by the post script
      build: {
        outDir: 'storybook-static'
      }
    })
  }
}

export default config

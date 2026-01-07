import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true
  },
  stories: [
    '../stories/getting-started/installation-guide.mdx',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|ts)'
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/preset-scss',
    '@storybook/addon-themes',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: 'vue-docgen-api'
    },
  },
  typescript: {
    check: false,
    reactDocgen: false
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

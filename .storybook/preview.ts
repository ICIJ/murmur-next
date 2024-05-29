import { setup } from '@storybook/vue3'
import { useArgs } from '@storybook/preview-api'

import './app.scss'
import Murmur from '@/main'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

setup((app) => {
  app.use(Murmur)
})

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark'
    },
    defaultTheme: 'light',
    attributeName: 'data-bs-theme'
  }),
  /**
   * Support `v-model` for vue
   * @see {@link https://craigbaldwin.com/blog/updating-args-storybook-vue/}
   */
  (story, context) => {
    const [args, updateArgs] = useArgs()
    if ('modelValue' in args) {
      const update = args['onUpdate:model-value'] || args['onUpdate:modelValue']
      args['onUpdate:model-value'] = undefined
      args['onUpdate:modelValue'] = (...vals) => {
        update?.(...vals)
        /**
         * Arg with `undefined` will be deleted by `deleteUndefined()`, then loss of reactive
         * @see {@link https://github.com/storybookjs/storybook/blob/next/code/lib/preview-api/src/modules/store/ArgsStore.ts#L63}
         */
        const modelValue = vals[0] === undefined ? null : vals[0]
        updateArgs({ modelValue })
      }
    }
    return story({ ...context, updateArgs })
  }
]

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export default {
  parameters,
  decorators,
  tags: ['autodocs']
};

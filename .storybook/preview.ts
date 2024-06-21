import { setup } from '@storybook/vue3'
import { styled } from '@storybook/theming'
import { useArgs } from '@storybook/preview-api'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import './app.scss'
import Murmur from '@/main'

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

const style = { 
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important'
}

const styleH1 = {
  fontFamily: `"Anton", ${style.fontFamily}`,
  fontWeight: '400',
  fontSize: '2.5rem',
  // In kebab-case to respect the type definition
  'text-transform': 'uppercase'
}

export const parameters = {
  docs: {
    components: {
      h1: styled.h1(() => styleH1),
      h2: styled.h1(() => style),
      h3: styled.h1(() => style),
      h4: styled.h1(() => style),
      h5: styled.h1(() => style),
      section: styled.section(() => style),
      p: styled.p(() => style),
      div: styled.div(() => style),
      span: styled.span(() => style),
      input: styled.input(() => style)
    },
  },
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
  tags: ['autodocs'],
};

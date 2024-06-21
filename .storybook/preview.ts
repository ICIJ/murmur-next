import { setup } from '@storybook/vue3'
import { styled } from '@storybook/theming'
import { useArgs } from '@storybook/preview-api'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import './preview.scss'
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
  fontFamily: 'var(--bs-font-sans-serif) !important',
  fontSize: '1rem',
}

const headingsStyle = {
  fontFamily: 'var(--bs-font-sans-serif) !important',
  fontWeight: 'var(--bs-headings-weight-bold)'
}

const h1Style = {
  ...headingsStyle,
  fontFamily: `"Anton", ${style.fontFamily}`,
  fontSize: '2.5rem',
  // In kebab-case to respect the type definition
  'text-transform': 'uppercase'
}

const aStyle = {
  ...style,
  color: 'rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1));',
  '&:hover': {
    textDecoration: 'underline'
  }
}

export const parameters = {
  docs: {
    components: {
      h1: styled.h1(() => h1Style),
      h2: styled.h2(() => headingsStyle),
      h3: styled.h3(() => headingsStyle),
      h4: styled.h4(() => headingsStyle),
      h5: styled.h5(() => headingsStyle),
      h6: styled.h6(() => headingsStyle),
      a: styled.a(() => aStyle),
      section: styled.section(() => style),
      p: styled.p(() => style),
      div: styled.div(() => style),
      pre: styled.div(() => ({ })),
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
  decorators
};

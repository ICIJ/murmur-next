import { setup, Preview } from '@storybook/vue3'
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
  })
]
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

const preview: Preview = {
  parameters
}
export default preview

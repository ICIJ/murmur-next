import { create } from '@storybook/theming/create'
import brandImage from '../lib/assets/images/murmur-dark.svg'

export default create({
  base: 'dark',
  brandTitle: 'Murmur',
  brandUrl: 'https://icij.github.io/murmur-next/',
  brandTarget: '_self',
  brandImage,
  appBg: '#000000',
  appBorderColor: '#212121',
  appBorderRadius: 0,
  barBg: '#212121',
  colorPrimary: '#FF0000',
  colorSecondary: '#999999',
  fontBase: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  buttonBg: '#FF0000',
  buttonColor: '#FFFFFF',
  buttonBorder: '#FF0000',
  booleanBg: '#e9e9e9',
  booleanSelectedBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#696969',
  inputTextColor: '#000000',
  inputBorderRadius: 0
})

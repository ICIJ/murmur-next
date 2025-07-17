import { create } from 'storybook/theming/create'
import brandImage from '../lib/assets/images/murmur-textured.png'

export default create({
  base: 'dark',
  brandTitle: 'Murmur',
  brandUrl: '?=/',
  brandTarget: '_self',
  brandImage,

  colorPrimary: '#00F',
  colorSecondary: '#F00',

  // UI
  appBg: '#000',
  appContentBg: '#171717',
  appPreviewBg: '#FFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Text colors
  textColor: '#C9CDCF',
  textInverseColor: '#222425',
  textMutedColor: '#798186',

  // Toolbar default and active colors
  barTextColor: '#333',
  barHoverColor: '#000',
  barSelectedColor: '#F00',
  barBg: '#e9e9e9',

  // Form colors
  buttonBg: '#222425',
  buttonBorder: 'rgba(255,255,255,.1)',
  booleanBg: '#222425',
  booleanSelectedBg: '#2E3438',
  inputBg: '#1B1C1D',
  inputBorder: 'rgba(255,255,255,.1)',
  inputTextColor: '#FFF',
  inputBorderRadius: 4
})

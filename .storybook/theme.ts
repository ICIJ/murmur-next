import { create } from 'storybook/theming/create'
import brandImage from '../lib/assets/images/murmur-textured.png'

export default create({
  base: 'dark',
  brandTitle: 'Murmur',
  brandUrl: '?=/',
  brandTarget: '_self',
  brandImage,

  colorPrimary: '#ff8080', 
  colorSecondary: '#f00',

  // UI
  appBg: '#0d0d0d',
  appPreviewBg: '#FFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Toolbar default and active colors
  barTextColor: '#eee',
  barHoverColor: '#ff8080',
  barSelectedColor: '#F00',
  barBg: '#000',

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

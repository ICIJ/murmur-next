import { BrandExpansion } from '@/components'

export default {
  title: 'Murmur/components/Brand/BrandExpansion',
  component: BrandExpansion,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['short', 'medium', 'long'] },
    animated: { control: 'boolean' },
    dark: { control: 'boolean' },
    color: { control: 'color' },
    background: { control: 'color' }
  }
}

export const Default = {
  args: { mode: 'short' }
}

export const Medium = {
  args: { mode: 'medium' }
}

export const Long = {
  args: { mode: 'long' }
}

export const Animated = {
  args: { animated: true }
}

export const WhiteBackground = {
  args: { background: '#FFF', color: '#000' }
}

export const BlackBackground = {
  args: { background: '#000', color: '#FFF' }
}

export const Dark = {
  args: { background: '#DDD', dark: true }
}

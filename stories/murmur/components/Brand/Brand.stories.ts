import { Brand } from '@/components'

export default {
  title: 'Murmur/components/Brand/Brand',
  component: Brand,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    background: { control: 'color' },
    size: { control: 'number' }
  }
}

export const Default = {
  args: {}
}

export const Animated = {
  args: {
    animated: true,
    background: '#cacaca'
  }
}

export const Square = {
  args: {
    square: true,
    background: '#cacaca'
  }
}

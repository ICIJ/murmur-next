import { Brand } from '@/components'
import { bgInlineFlexPolkaDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/Brand/Brand',
  component: Brand,
  tags: ['autodocs'],
  decorators: [bgInlineFlexPolkaDecorator],
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
    animated: true
  }
}

export const Square = {
  args: {
    square: true
  }
}

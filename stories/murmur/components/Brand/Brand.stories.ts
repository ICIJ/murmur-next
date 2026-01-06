import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { Brand } from '@/components'
import { bgInlineFlexPolkaDecorator } from '../../decorators'

const meta: Meta<typeof Brand> = {
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

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const Animated: Story = {
  args: {
    animated: true
  }
}

export const Square: Story = {
  args: {
    square: true
  }
}

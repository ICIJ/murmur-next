import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { HapticCopy } from '@/components'
import { BBadge } from 'bootstrap-vue-next'

const meta: Meta<typeof HapticCopy> = {
  title: 'Murmur/components/HapticCopy/HapticCopy',
  component: HapticCopy,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div class="p-2 text-center"><story/></div>' })],
  argTypes: {
    hideLabel: { control: 'boolean' },
    tooltipPlacement: { control: 'text' },
    title: { control: 'text' }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Lorem info sit amet',
    variant: 'info'
  }
}

export const Feedback: Story = {
  args: {
    hideLabel: true,
    tooltipPlacement: 'right',
    text: 'Lorem info sit amet',
    variant: 'secondary'
  }
}

export const PillBadge: Story = {
  args: {
    text: 'Lorem info sit amet',
    variant: 'warning',
    pill: true,
    tag: BBadge
  }
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ResponsiveIframe } from '@/components'

const meta: Meta<typeof ResponsiveIframe> = {
  title: 'Murmur/components/ResponsiveIframe/ResponsiveIframe',
  component: ResponsiveIframe,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: 'https://projects.icij.org/the-implant-files/graphics/#/adverse-events?no-embeddable-footer=1'
  }
}

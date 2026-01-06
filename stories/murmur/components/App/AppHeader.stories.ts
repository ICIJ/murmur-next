import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { AppHeader } from '@/components'

const meta: Meta<typeof AppHeader> = {
  title: 'Murmur/components/App/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  argTypes: {
    brandOptions: { control: 'select' }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  decorators: [() => ({ template: '<div style="height: 1800px"><story/></div>' })],
  parameters: { layout: 'fullscreen' }
}

export const NoHeadroom: Story = {
  args: { noHeadroom: true, position: 'relative' }
}

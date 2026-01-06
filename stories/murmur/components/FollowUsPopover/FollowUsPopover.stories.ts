import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FollowUsPopover } from '@/components'

const meta: Meta<typeof FollowUsPopover> = {
  title: 'Murmur/components/FollowUsPopover/FollowUsPopover',
  component: FollowUsPopover,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    class: 'card card-xs my-4 mx-auto border border-primary'
  }
}

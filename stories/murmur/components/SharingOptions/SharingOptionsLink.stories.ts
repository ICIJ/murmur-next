import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { SharingOptionsLink } from '@/components'

const meta: Meta<typeof SharingOptionsLink> = {
  title: 'Murmur/components/SharingOptions/SharingOptionsLink',
  component: SharingOptionsLink,
  tags: ['autodocs'],
  argTypes: {
    network: {
      control: 'select',
      options: ['twitter', 'facebook', 'linkedin', 'email']
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    network: 'twitter',
    class: 'btn btn-outline-primary mx-1',
    url: 'https://www.icij.org'
  }
}

export const CustomSlot: Story = {
  args: {
    network: 'twitter',
    class: 'btn btn-outline-primary mx-1',
    url: 'https://www.icij.org',
    noIcon: true
  },
  render: (args: any) => ({
    components: { SharingOptionsLink },
    setup: () => ({ args }),
    template: '<SharingOptionsLink v-bind="args">Share twitter</SharingOptionsLink>'
  })
}

export const CustomTagAndSlot: Story = {
  args: {
    network: 'twitter',
    title: 'Murmur Design System',
    class: 'btn btn-warning',
    url: 'https://www.icij.org',
    noIcon: true,
    tag: 'button'
  },
  render: (args: any) => ({
    components: { SharingOptionsLink },
    setup: () => ({ args }),
    template: '<SharingOptionsLink v-bind="args">Twitter Button</SharingOptionsLink>'
  })
}

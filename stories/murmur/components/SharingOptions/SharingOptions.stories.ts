import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { SharingOptions } from '@/components'

const meta: Meta<typeof SharingOptions> = {
  title: 'Murmur/components/SharingOptions/SharingOptions',
  component: SharingOptions,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse']
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const WithUrl: Story = {
  args: {
    url: 'https://www.icij.org/',
    class: 'justify-content-center'
  }
}

export const DirectionColumn: Story = {
  args: {
    direction: 'column'
  }
}

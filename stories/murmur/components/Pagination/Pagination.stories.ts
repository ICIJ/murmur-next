import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { buttonSizesArgType } from '~storybook/utils'
import { Pagination } from '@/components'
import { SIZE } from '@/enums'

const meta: Meta<typeof Pagination> = {
  title: 'Murmur/components/Pagination/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    perPage: { control: 'number' },
    totalRows: { control: 'number' },
    pages: { control: 'number' },
    size: buttonSizesArgType
  },
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const Small: Story = {
  args: { size: SIZE.sm }
}

export const Medium: Story = {
  args: { size: 'md' }
}

export const Large: Story = {
  args: { size: SIZE.lg }
}

export const Compact: Story = {
  args: { compact: true }
}

export const Pills: Story = {
  args: { pills: true }
}

export const PillsSmall: Story = {
  args: {
    pills: true,
    size: SIZE.sm
  }
}

export const PillsCompact: Story = {
  args: {
    pills: true,
    compact: true
  }
}

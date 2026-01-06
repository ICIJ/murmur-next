import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { buttonSizesArgType } from '~storybook/utils'
import { PaginationTiny } from '@/components'
import { SIZE } from '@/enums'

const meta: Meta<typeof PaginationTiny> = {
  title: 'Murmur/components/Pagination/PaginationTiny',
  component: PaginationTiny,
  tags: ['autodocs'],
  argTypes: {
    size: buttonSizesArgType,
    pages: {
      control: 'number',
      min: 0
    },
    row: {
      type: 'boolean'
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: 1,
    totalRows: 200
  }
}

export const Small: Story = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.sm
  }
}

export const Medium: Story = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.md
  }
}

export const Large: Story = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.lg
  }
}

export const HideNavigation: Story = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    noNav: true
  }
}

export const CompactMode: Story = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    compact: true
  }
}

export const RowMode: Story = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 2e6,
    compact: false,
    row: true
  }
}

export const UniqueRowMode: Story = {
  args: {
    modelValue: 1,
    perPage: 1,
    totalRows: 2e6,
    compact: false,
    row: true
  }
}

export const CompactRowMode: Story = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 2e6,
    compact: true,
    row: true
  }
}

export const RowModeFewer: Story = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 20,
    compact: false,
    row: true
  }
}

export const RowModeNextFewer: Story = {
  args: {
    modelValue: 2,
    perPage: 25,
    totalRows: 50,
    compact: false,
    row: true
  }
}

export const RowModeSingle: Story = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 1,
    compact: false,
    row: true
  }
}

export const RowModeZero: Story = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 0,
    compact: false,
    row: true
  }
}

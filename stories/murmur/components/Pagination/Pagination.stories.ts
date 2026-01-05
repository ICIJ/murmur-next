import { buttonSizesArgType } from '~storybook/utils'
import { Pagination } from '@/components'
import { SIZE } from '@/enums'

export default {
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

export const Default = {
  args: {}
}

export const Small = {
  args: { size: SIZE.sm }
}

export const Medium = {
  args: { size: 'md' }
}

export const Large = {
  args: { size: SIZE.lg }
}

export const Compact = {
  args: { compact: true }
}

export const Pills = {
  args: { pills: true }
}

export const PillsSmall = {
  args: {
    pills: true,
    size: SIZE.sm
  }
}

export const PillsCompact = {
  args: {
    pills: true,
    compact: true
  }
}

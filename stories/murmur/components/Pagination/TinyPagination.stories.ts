import { buttonSizesArgType } from '~storybook/utils'
import { TinyPagination } from '@/components'
import { SIZE } from '@/enums'

export default {
  title: 'Murmur/components/Pagination/TinyPagination',
  component: TinyPagination,
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

export const Default = {
  args: {
    modelValue: 1,
    totalRows: 200
  }
}

export const Small = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.sm
  }
}

export const Medium = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.md
  }
}

export const Large = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    size: SIZE.lg
  }
}

export const HideNavigation = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    noNav: true
  }
}

export const CompactMode = {
  args: {
    modelValue: 1,
    perPage: 10,
    totalRows: 200,
    compact: true
  }
}

export const RowMode = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 2e6,
    compact: false,
    row: true
  }
}

export const UniqueRowMode = {
  args: {
    modelValue: 1,
    perPage: 1,
    totalRows: 2e6,
    compact: false,
    row: true
  }
}

export const CompactRowMode = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 2e6,
    compact: true,
    row: true
  }
}

export const RowModeFewer = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 20,
    compact: false,
    row: true
  }
}

export const RowModeNextFewer = {
  args: {
    modelValue: 2,
    perPage: 25,
    totalRows: 50,
    compact: false,
    row: true
  }
}

export const RowModeSingle = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 1,
    compact: false,
    row: true
  }
}

export const RowModeZero = {
  args: {
    modelValue: 1,
    perPage: 25,
    totalRows: 0,
    compact: false,
    row: true
  }
}

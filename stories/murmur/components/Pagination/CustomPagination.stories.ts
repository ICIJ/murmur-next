import { StoryObj } from '@storybook/vue3-vite'
import { buttonSizesArgType } from '~storybook/utils'
import { CustomPagination } from '@/components'
import { SIZE } from '@/enums'

export default {
  title: 'Murmur/components/Pagination/CustomPagination',
  component: CustomPagination,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { type: 'number', min: 0 },
    perPage: { type: 'number', min: 0 },
    totalRows: { type: 'number', min: 0 },
    pages: { type: 'number', min: 0 },
    size: buttonSizesArgType
  }
}

type Story = StoryObj<typeof CustomPagination>
const Template: Story = (args: any) => ({
  components: { CustomPagination },
  setup() {
    return { args }
  },
  template: '<CustomPagination v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = { modelValue: 1, perPage: 10, totalRows: 200 }
export const Small = Template.bind({})
Small.args = { modelValue: 1, perPage: 10, totalRows: 200, size: SIZE.sm }
export const Medium = Template.bind({})
Medium.args = { modelValue: 1, perPage: 10, totalRows: 200, size: 'md' }
export const Large = Template.bind({})
Large.args = { modelValue: 1, perPage: 10, totalRows: 200, size: SIZE.lg }
export const Compact = Template.bind({})
Compact.args = { modelValue: 1, perPage: 10, totalRows: 200, compact: true }
export const Pills = Template.bind({})
Pills.args = { modelValue: 1, perPage: 10, totalRows: 200, pills: true }
export const PillsSmall = Template.bind({})
PillsSmall.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  pills: true,
  size: SIZE.sm
}
export const PillsCompact = Template.bind({})
PillsCompact.args = {
  modelValue: 1,
  perPage: 10,
  totalRows: 200,
  pills: true,
  compact: true
}

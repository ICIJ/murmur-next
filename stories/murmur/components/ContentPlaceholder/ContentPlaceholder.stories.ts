import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ContentPlaceholder } from '@/components'
import { ContentPlaceholderRows } from '@/utils/placeholderTypes'

const meta: Meta<typeof ContentPlaceholder> = {
  title: 'Murmur/components/ContentPlaceholder/ContentPlaceholder',
  component: ContentPlaceholder,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const columnRows: ContentPlaceholderRows = [
  {
    height: '1em',
    boxes: [
      [0, '40%'],
      ['5%', '30%'],
      ['5%', '10%']
    ]
  }
]

const fourRowsDecorator = () => ({
  components: { ContentPlaceholder },
  template: `
    <div class="card card-xs py-2 px-3 mx-auto m-4">
      <story/>
      <story/>
      <story/>
      <story/>
    </div>
  `
})

export const Default: Story = {
  args: {}
}

export const Columns: Story = {
  args: { rows: columnRows }
}

export const FourRows: Story = {
  args: { class: 'my-1' },
  decorators: [fourRowsDecorator]
}

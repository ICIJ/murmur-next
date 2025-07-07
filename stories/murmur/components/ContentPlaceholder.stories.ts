import { ContentPlaceholder } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { ContentPlaceholderRows } from '@/utils/placeholderTypes'

export default {
  title: 'Murmur/components/ContentPlaceholder',
  component: ContentPlaceholder,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof ContentPlaceholder>
const Template: Story = (args: any) => ({
  components: { ContentPlaceholder },
  setup() {
    return { args }
  },
  template: '<ContentPlaceholder v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}

export const Columns = Template.bind({})
const rows: ContentPlaceholderRows = [
  {
    height: '1em',
    boxes: [
      [0, '40%'],
      ['5%', '30%'],
      ['5%', '10%']
    ]
  }
]
Columns.args = { rows }
export const FourRows = Template.bind({})
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
FourRows.decorators = [fourRowsDecorator]
FourRows.args = { class: 'my-1' }

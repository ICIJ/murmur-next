import { GenericHeader } from '@/components'
import { StoryObj } from '@storybook/vue3'

export default {
  title: 'Murmur/components/GenericHeader',
  component: GenericHeader,
  tags: ['autodocs'],
  argTypes: {
    brandOptions: { type: 'select' }
  }
}

type Story = StoryObj<typeof GenericHeader>
const Template: Story = (args: any) => ({
  components: { GenericHeader },
  setup() {
    return { args }
  },
  template: '<GenericHeader v-bind="args" ></GenericHeader>'
})

export const Default = Template.bind({})
Default.args = {}
Default.decorators = [
  () => ({ template: '<div style="height: 1800px"><story/></div>' })
]
Default.parameters = { layout: 'fullscreen' }
export const NoHeadroom = Template.bind({})
NoHeadroom.args = { noHeadroom: true, position: 'relative' }

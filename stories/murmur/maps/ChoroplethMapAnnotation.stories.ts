import { ChoroplethMapAnnotation } from '@/maps'
import { StoryObj } from '@storybook/vue3'

export default {
  title: 'Murmur/maps/ChoroplethMapAnnotation',
  component: ChoroplethMapAnnotation,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof ChoroplethMapAnnotation>
const Template: Story = (args: any) => ({
  components: { ChoroplethMapAnnotation },
  setup() {
    return { args }
  },
  template: `<ChoroplethMapAnnotation v-bind="args" />`
})

export const Default = Template.bind({})
Default.args = {}

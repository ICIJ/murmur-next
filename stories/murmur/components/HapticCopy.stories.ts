import { HapticCopy } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
type Story = StoryObj<typeof HapticCopy>

const Template: Story = (args: any, { argTypes }: any) => ({
  components: { HapticCopy },
  props: Object.keys(argTypes),
  setup() {
    return { args }
  },
  template: `<HapticCopy v-bind="args" />`
})

export const Default = Template.bind({})
Default.args = {
  text: 'Lorem info sit amet',
  class: 'btn-info'
}

export const Feedback = Template.bind({})
Feedback.template = `<HapticCopy  v-bind="args" /></button>`
Feedback.args = {
  hideLabel: true,
  tooltipPlacement: 'right',
  text: 'Lorem info sit amet',
  class: 'btn-secondary'
}

export default {
  title: 'Murmur/Components/HapticCopy',
  component: HapticCopy,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: "<div class='p-2 text-center'><story/></div>" })
  ],
  argTypes: {
    hideLabel: { control: 'boolean' },
    tooltipPlacement: { control: 'text' },
    title: { control: 'text' }
  }
}

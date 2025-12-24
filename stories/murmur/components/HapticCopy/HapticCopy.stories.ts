import { HapticCopy } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { BBadge } from 'bootstrap-vue-next'

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
  variant: 'info'
}

export const Feedback = Template.bind({})
Feedback.args = {
  hideLabel: true,
  tooltipPlacement: 'right',
  text: 'Lorem info sit amet',
  variant: 'secondary'
}

export const PillBadge = Template.bind({})
PillBadge.args = {
  text: 'Lorem info sit amet',
  variant: 'warning',
  pill: true,
  tag: BBadge
}

export default {
  title: 'Murmur/components/HapticCopy/HapticCopy',
  component: HapticCopy,
  tags: ['autodocs'],
  decorators: [
    () => ({ template: '<div class=\'p-2 text-center\'><story/></div>' })
  ],
  argTypes: {
    hideLabel: { control: 'boolean' },
    tooltipPlacement: { control: 'text' },
    title: { control: 'text' }
  }
}

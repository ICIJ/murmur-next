import { FollowUsPopover } from '@/components'
import { StoryObj } from '@storybook/vue3'

export default {
  title: 'Murmur/components/FollowUsPopover',
  component: FollowUsPopover,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof FollowUsPopover>
const Template: Story = (args: any) => ({
  components: { FollowUsPopover },
  setup() {
    return { args }
  },
  template: '<FollowUsPopover v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  class: 'card card-xs my-4 mx-auto border border-primary'
}

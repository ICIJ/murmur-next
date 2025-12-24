import { FormDonate } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { SIZE } from '@/enums'
import { modalDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/Form/FormDonate',
  component: FormDonate,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof FormDonate>
const Template: Story = (args: any) => ({
  components: { FormDonate },
  setup() {
    return { args }
  },
  template: '<FormDonate v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}

export const InModal = Template.bind({})
InModal.decorators = [
  modalDecorator.bind(this, 'Click to see the form', 'Support ICIJ', SIZE.lg)
]
InModal.args = {
  noTitle: true
}

import { DonateForm } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { SIZE } from '@/enums'
import { modalDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/DonateForm/DonateForm',
  component: DonateForm,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof DonateForm>
const Template: Story = (args: any) => ({
  components: { DonateForm },
  setup() {
    return { args }
  },
  template: '<DonateForm v-bind="args" />'
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

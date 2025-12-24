import { ButtonConfirm } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'

export default {
  title: 'Murmur/components/Button/ButtonConfirm',
  component: ButtonConfirm,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof ButtonConfirm>
const Template: Story = (args: any) => ({
  components: { ButtonConfirm },
  setup() {
    return { args }
  },
  template: `<ButtonConfirm v-bind="args" >Click to confirm</ButtonConfirm>`
})

function confirmedFn() {
  alert('Confirmed !')
}
export const Default = Template.bind({})
Default.args = {
  class: 'btn btn-info',
  confirmed: confirmedFn,
  noCloseButton: true
}
export const WithDescription = Template.bind({})
WithDescription.args = {
  class: 'btn btn-info',
  description: 'Do, or do not. There is no try.'
}
export const WithLabel = Template.bind({})
WithLabel.args = {
  class: 'btn btn-info',
  label: 'Will you bilge Matey?',
  yes: 'Aye',
  no: 'Abandon ship!'
}

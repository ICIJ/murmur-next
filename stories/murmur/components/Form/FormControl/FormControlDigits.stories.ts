import { FormControlDigits } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'

export default {
  title: 'Murmur/components/Form/FormControl/FormControlDigits',
  component: FormControlDigits,
  tags: ['autodocs'],
  argTypes: {
    length: { type: 'number', min: 0 }
  }
}

type Story = StoryObj<typeof FormControlDigits>
const Template: Story = (args: any) => ({
  components: { FormControlDigits },
  setup() {
    return { args }
  },
  template: '<FormControlDigits v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
export const FourDigits = Template.bind({})
FourDigits.args = {
  length: 4,
  modelValue: 2017
}

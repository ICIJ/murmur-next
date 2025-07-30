import { StoryObj } from '@storybook/vue3-vite'
import { variantsArgType } from '~storybook/utils'
import { SignUpForm } from '@/components'

export default {
  title: 'Murmur/components/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType
  }
}

type Story = StoryObj<typeof SignUpForm>
const Template: Story = (args: any) => ({
  components: { SignUpForm },
  setup() {
    return { args }
  },
  template: '<SignUpForm v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}

export const Variant = Template.bind({})
Variant.args = {
  variant: 'secondary'
}
export const Horizontal = Template.bind({})
Horizontal.args = {
  variant: 'secondary',
  horizontal: true,
  defaultGroups: 'group[9][1],group[9][131072]'
}
export const NoLabel = Template.bind({})
NoLabel.args = {
  noLabel: true
}
export const MailChimpGroups = Template.bind({})
MailChimpGroups.args = {
  defaultGroups: 'group[9][1],group[9][131072]'
}

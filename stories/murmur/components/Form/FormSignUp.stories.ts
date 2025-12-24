import { StoryObj } from '@storybook/vue3-vite'
import { variantsArgType } from '~storybook/utils'
import { FormSignUp } from '@/components'

export default {
  title: 'Murmur/components/Form/FormSignUp',
  component: FormSignUp,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType
  }
}

type Story = StoryObj<typeof FormSignUp>
const Template: Story = (args: any) => ({
  components: { FormSignUp },
  setup() {
    return { args }
  },
  template: '<FormSignUp v-bind="args" />'
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

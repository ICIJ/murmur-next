import { SecretInput } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { Size } from '../../../lib/enums'

export default {
  title: 'Murmur/components/SecretInput',
  component: SecretInput,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof SecretInput>
const Template: Story = (args: any) => ({
  components: { SecretInput },
  setup() {
    return { args }
  },
  template: '<SecretInput v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
export const NoToggler = Template.bind({})
NoToggler.args = { noToggler: true }
export const NoHapticCopy = Template.bind({})
NoHapticCopy.args = { noHapticCopy: true }
export const HideSecret = Template.bind({})
HideSecret.args = {
  value: 'this is a secret passphrase 🕵️‍♀️'
}
export const ShowSecret = Template.bind({})
ShowSecret.args = {
  value: 'this is a secret passphrase 🕵️‍♀️',
  visible: true
}
export const SmallSize = Template.bind({})
SmallSize.args = {
  value: 'this is a secret passphrase 🕵️‍♀️',
  visible: true,
  size: Size.sm
}
export const MediumSize = Template.bind({})
MediumSize.args = {
  value: 'this is a secret passphrase 🕵️‍♀️',
  visible: true,
  size: Size.md
}
export const LargeSize = Template.bind({})
LargeSize.args = {
  value: 'this is a secret passphrase 🕵️‍♀️',
  visible: true,
  size: Size.lg
}
export const HapticCopyVariant = Template.bind({})
HapticCopyVariant.args = {
  value: 'this is a secret passphrase 🕵️‍♀️',
  visible: true,
  hapticCopyVariant: 'secondary'
}

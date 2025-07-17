import { BrandExpansion } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'

export default {
  title: 'Murmur/components/BrandExpansion',
  component: BrandExpansion,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['short', 'medium', 'long'] },
    animated: { control: 'boolean' },
    dark: { control: 'boolean' },
    color: { control: { type: 'color' } },
    background: { control: { type: 'color' } }
  }
}

type Story = StoryObj<typeof BrandExpansion>
const Template: Story = (args: any) => ({
  components: { BrandExpansion },
  setup() {
    return { args }
  },
  template: '<BrandExpansion v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = { mode: 'short' }
export const Medium = Template.bind({})
Medium.args = { mode: 'medium' }

export const Long = Template.bind({})
Long.args = { mode: 'long' }
export const Animated = Template.bind({})
Animated.args = { animated: true }
export const WhiteBackground = Template.bind({})
WhiteBackground.args = { background: '#FFF', color: '#000' }
export const BlackBackground = Template.bind({})
BlackBackground.args = { background: '#000', color: '#FFF' }
export const Dark = Template.bind({})
Dark.args = { background: '#DDD', dark: true }

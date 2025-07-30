import { SharingOptionsLink } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'

export default {
  title: 'Murmur/components/SharingOptionsLink',
  component: SharingOptionsLink,
  tags: ['autodocs'],
  argTypes: {
    network: {
      control: 'select',
      options: ['twitter', 'facebook', 'linkedin', 'email']
    },
    default: {
      control: 'string'
    }
  },
  args: {
    default: null
  }
}

type Story = StoryObj<typeof SharingOptionsLink>

const Template: Story = (args: any) => ({
  components: { SharingOptionsLink },
  setup() {
    return { args }
  },
  template:
    '<sharing-options-link v-bind="args" />'
})

export const Default = Template.bind({})

Default.args = {
  network: 'twitter',
  class: 'btn btn-outline-primary mx-1',
  url: 'https://www.icij.org'
}

export const CustomSlot = {
  args: {
    network: 'twitter',
    class: 'btn btn-outline-primary mx-1',
    url: 'https://www.icij.org',
    noIcon: true,
    default: 'Share twitter'
  },
  render: args => ({
    components: { SharingOptionsLink },
    setup() {
      return { args }
    },
    template: '<sharing-options-link v-bind="args">{{args.default}}</sharing-options-link>'
  })
}

export const CustomTagAndSlot = {
  args: {
    network: 'twitter',
    title: 'Murmur Design System',
    class: 'btn btn-warning',
    url: 'https://www.icij.org',
    noIcon: true,
    tag: 'button',
    default: 'Twitter Button'
  },
  render: args => ({
    components: { SharingOptionsLink },
    setup() {
      return { args }
    },
    template: '<sharing-options-link v-bind="args">{{args.default}}</sharing-options-link>'
  })
}

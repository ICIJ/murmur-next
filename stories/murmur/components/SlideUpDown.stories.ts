import { SlideUpDown } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { toggleDecorator } from '../decorators'

export default {
  title: 'Murmur/components/SlideUpDown',
  component: SlideUpDown,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof SlideUpDown>
const Template: Story = (args: any) => ({
  components: { SlideUpDown },
  setup() {
    return { args }
  },
  template: `
    <slide-up-down v-bind="args">
        <div class="card-body">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
    </slide-up-down>`
})

export const Default = Template.bind({})
Default.args = {
  active: true
}
Default.decorators = [toggleDecorator]

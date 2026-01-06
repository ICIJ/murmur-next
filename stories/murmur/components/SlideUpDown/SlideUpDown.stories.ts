import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { SlideUpDown } from '@/components'
import { toggleDecorator } from '../../decorators'

const meta: Meta<typeof SlideUpDown> = {
  title: 'Murmur/components/SlideUpDown/SlideUpDown',
  component: SlideUpDown,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const loremText
  = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const Default: Story = {
  args: { active: true },
  decorators: [toggleDecorator],
  render: (args: any) => ({
    components: { SlideUpDown },
    setup: () => ({ args, loremText }),
    template: `
      <SlideUpDown v-bind="args">
        <div class="card-body">{{ loremText }}</div>
      </SlideUpDown>
    `
  })
}

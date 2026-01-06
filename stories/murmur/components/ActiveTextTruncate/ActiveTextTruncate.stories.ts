import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ActiveTextTruncate } from '@/components'
import { bgFlexPolkaDecorator } from '../../decorators'

const meta: Meta<typeof ActiveTextTruncate> = {
  title: 'Murmur/components/ActiveTextTruncate/ActiveTextTruncate',
  component: ActiveTextTruncate,
  tags: ['autodocs'],
  decorators: [bgFlexPolkaDecorator],
  argTypes: {
    direction: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    ppms: { control: 'number' },
    fadingMinWidth: { control: 'number' },
    fadingMaxWidth: { control: 'number' }
  }
}

export default meta

type Story = StoryObj<typeof meta>

const longUrl
  = 'https://www.icij.org/investigations/luanda-leaks/banking-documents-reveal-consulting-giants-cash-windfall-under-angolan-billionaire-isabel-dos-santos/'

export const Default: Story = {
  args: { direction: 'ltr' },
  render: (args: any) => ({
    components: { ActiveTextTruncate },
    setup: () => ({ args, longUrl }),
    template: '<ActiveTextTruncate v-bind="args">{{ longUrl }}</ActiveTextTruncate>'
  })
}

export const RightToLeft: Story = {
  args: { direction: 'rtl' },
  render: (args: any) => ({
    components: { ActiveTextTruncate },
    setup: () => ({ args, longUrl }),
    template: '<ActiveTextTruncate v-bind="args">{{ longUrl }}</ActiveTextTruncate>'
  })
}

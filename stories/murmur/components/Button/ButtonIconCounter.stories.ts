import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ButtonIconCounter } from '@/components'
import { variantsArgType } from '~storybook/utils'
import { VARIANT } from '@/enums'

const meta: Meta<typeof ButtonIconCounter> = {
  title: 'Murmur/components/Button/ButtonIconCounter',
  component: ButtonIconCounter,
  tags: ['autodocs'],
  argTypes: {
    counter: {
      control: { type: 'number' }
    },
    variant: variantsArgType
  },
  args: {
    variant: VARIANT.secondary,
    counter: 123
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

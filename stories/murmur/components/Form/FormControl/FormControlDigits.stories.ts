import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FormControlDigits } from '@/components'

const meta: Meta<typeof FormControlDigits> = {
  title: 'Murmur/components/Form/FormControl/FormControlDigits',
  component: FormControlDigits,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'number' }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const FourDigits: Story = {
  args: {
    length: 4,
    modelValue: 2017
  }
}

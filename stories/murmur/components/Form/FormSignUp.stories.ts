import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { variantsArgType } from '~storybook/utils'
import { FormSignUp } from '@/components'

const meta: Meta<typeof FormSignUp> = {
  title: 'Murmur/components/Form/FormSignUp',
  component: FormSignUp,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const Variant: Story = {
  args: {
    variant: 'secondary'
  }
}

export const Horizontal: Story = {
  args: {
    variant: 'secondary',
    horizontal: true,
    defaultGroups: 'group[9][1],group[9][131072]'
  }
}

export const NoLabel: Story = {
  args: {
    noLabel: true
  }
}

export const MailChimpGroups: Story = {
  args: {
    defaultGroups: 'group[9][1],group[9][131072]'
  }
}

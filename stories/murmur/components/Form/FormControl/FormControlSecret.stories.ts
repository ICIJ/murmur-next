import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FormControlSecret } from '@/components'
import { SIZE } from '@/enums'

const meta: Meta<typeof FormControlSecret> = {
  title: 'Murmur/components/Form/FormControl/FormControlSecret',
  component: FormControlSecret,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const secretValue = 'this is a secret passphrase'

export const Default: Story = {
  args: {}
}

export const NoToggler: Story = {
  args: { noToggler: true }
}

export const NoHapticCopy: Story = {
  args: { noHapticCopy: true }
}

export const HideSecret: Story = {
  args: { value: secretValue }
}

export const ShowSecret: Story = {
  args: {
    value: secretValue,
    visible: true
  }
}

export const SmallSize: Story = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.sm
  }
}

export const MediumSize: Story = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.md
  }
}

export const LargeSize: Story = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.lg
  }
}

export const HapticCopyVariant: Story = {
  args: {
    value: secretValue,
    visible: true,
    hapticCopyVariant: 'secondary'
  }
}

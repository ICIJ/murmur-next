import { FormControlSecret } from '@/components'
import { SIZE } from '@/enums'

export default {
  title: 'Murmur/components/Form/FormControl/FormControlSecret',
  component: FormControlSecret,
  tags: ['autodocs'],
  argTypes: {}
}

const secretValue = 'this is a secret passphrase 🕵️‍♀️'

export const Default = {
  args: {}
}

export const NoToggler = {
  args: { noToggler: true }
}

export const NoHapticCopy = {
  args: { noHapticCopy: true }
}

export const HideSecret = {
  args: { value: secretValue }
}

export const ShowSecret = {
  args: {
    value: secretValue,
    visible: true
  }
}

export const SmallSize = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.sm
  }
}

export const MediumSize = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.md
  }
}

export const LargeSize = {
  args: {
    value: secretValue,
    visible: true,
    size: SIZE.lg
  }
}

export const HapticCopyVariant = {
  args: {
    value: secretValue,
    visible: true,
    hapticCopyVariant: 'secondary'
  }
}

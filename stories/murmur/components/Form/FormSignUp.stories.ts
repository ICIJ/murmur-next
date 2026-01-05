import { variantsArgType } from '~storybook/utils'
import { FormSignUp } from '@/components'

export default {
  title: 'Murmur/components/Form/FormSignUp',
  component: FormSignUp,
  tags: ['autodocs'],
  argTypes: {
    variant: variantsArgType
  }
}

export const Default = {
  args: {}
}

export const Variant = {
  args: {
    variant: 'secondary'
  }
}

export const Horizontal = {
  args: {
    variant: 'secondary',
    horizontal: true,
    defaultGroups: 'group[9][1],group[9][131072]'
  }
}

export const NoLabel = {
  args: {
    noLabel: true
  }
}

export const MailChimpGroups = {
  args: {
    defaultGroups: 'group[9][1],group[9][131072]'
  }
}

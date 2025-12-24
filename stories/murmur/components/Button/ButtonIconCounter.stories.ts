import { ButtonIconCounter } from '@/components'
import { variantsArgType } from '~storybook/utils'
import { VARIANT } from '@/enums'

export default {
  components: { ButtonIconCounter },
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
    variant: VARIANT.SECONDARY,
    counter: 123
  }
}

export const Default = {}

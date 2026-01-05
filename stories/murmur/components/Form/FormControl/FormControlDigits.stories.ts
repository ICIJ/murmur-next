import { FormControlDigits } from '@/components'

export default {
  title: 'Murmur/components/Form/FormControl/FormControlDigits',
  component: FormControlDigits,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'number' }
  }
}

export const Default = {
  args: {}
}

export const FourDigits = {
  args: {
    length: 4,
    modelValue: 2017
  }
}

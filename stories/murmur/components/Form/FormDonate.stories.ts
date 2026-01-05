import { FormDonate } from '@/components'
import { SIZE } from '@/enums'
import { modalDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/Form/FormDonate',
  component: FormDonate,
  tags: ['autodocs'],
  argTypes: {}
}

export const Default = {
  args: {}
}

export const InModal = {
  args: { noTitle: true },
  decorators: [modalDecorator.bind(null, 'Click to see the form', 'Support ICIJ', SIZE.lg)]
}

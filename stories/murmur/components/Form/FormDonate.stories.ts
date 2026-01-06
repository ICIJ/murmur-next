import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FormDonate } from '@/components'
import { SIZE } from '@/enums'
import { modalDecorator } from '../../decorators'

const meta: Meta<typeof FormDonate> = {
  title: 'Murmur/components/Form/FormDonate',
  component: FormDonate,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const InModal: Story = {
  args: { noTitle: true },
  decorators: [modalDecorator.bind(null, 'Click to see the form', 'Support ICIJ', SIZE.lg)]
}

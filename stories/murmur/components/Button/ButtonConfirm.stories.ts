import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ButtonConfirm } from '@/components'

const meta: Meta<typeof ButtonConfirm> = {
  title: 'Murmur/components/Button/ButtonConfirm',
  component: ButtonConfirm,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

function confirmedFn() {
  alert('Confirmed !')
}

export const Default: Story = {
  args: {
    class: 'btn btn-info',
    confirmed: confirmedFn,
    noCloseButton: true
  },
  render: (args: any) => ({
    components: { ButtonConfirm },
    setup: () => ({ args }),
    template: '<ButtonConfirm v-bind="args">Click to confirm</ButtonConfirm>'
  })
}

export const WithDescription: Story = {
  args: {
    class: 'btn btn-info',
    description: 'Do, or do not. There is no try.'
  },
  render: (args: any) => ({
    components: { ButtonConfirm },
    setup: () => ({ args }),
    template: '<ButtonConfirm v-bind="args">Click to confirm</ButtonConfirm>'
  })
}

export const WithLabel: Story = {
  args: {
    class: 'btn btn-info',
    label: 'Will you bilge Matey?',
    yes: 'Aye',
    no: 'Abandon ship!'
  },
  render: (args: any) => ({
    components: { ButtonConfirm },
    setup: () => ({ args }),
    template: '<ButtonConfirm v-bind="args">Click to confirm</ButtonConfirm>'
  })
}

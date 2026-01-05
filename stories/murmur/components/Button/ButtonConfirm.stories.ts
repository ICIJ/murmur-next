import { ButtonConfirm } from '@/components'

export default {
  title: 'Murmur/components/Button/ButtonConfirm',
  component: ButtonConfirm,
  tags: ['autodocs'],
  argTypes: {}
}

function confirmedFn() {
  alert('Confirmed !')
}

export const Default = {
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

export const WithDescription = {
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

export const WithLabel = {
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

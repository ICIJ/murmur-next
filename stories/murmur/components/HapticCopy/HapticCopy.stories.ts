import { HapticCopy } from '@/components'
import { BBadge } from 'bootstrap-vue-next'

export default {
  title: 'Murmur/components/HapticCopy/HapticCopy',
  component: HapticCopy,
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div class="p-2 text-center"><story/></div>' })],
  argTypes: {
    hideLabel: { control: 'boolean' },
    tooltipPlacement: { control: 'text' },
    title: { control: 'text' }
  }
}

export const Default = {
  args: {
    text: 'Lorem info sit amet',
    variant: 'info'
  }
}

export const Feedback = {
  args: {
    hideLabel: true,
    tooltipPlacement: 'right',
    text: 'Lorem info sit amet',
    variant: 'secondary'
  }
}

export const PillBadge = {
  args: {
    text: 'Lorem info sit amet',
    variant: 'warning',
    pill: true,
    tag: BBadge
  }
}

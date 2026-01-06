import { AppHeader } from '@/components'

export default {
  title: 'Murmur/components/App/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  argTypes: {
    brandOptions: { control: 'select' }
  }
}

export const Default = {
  args: {},
  decorators: [() => ({ template: '<div style="height: 1800px"><story/></div>' })],
  parameters: { layout: 'fullscreen' }
}

export const NoHeadroom = {
  args: { noHeadroom: true, position: 'relative' }
}

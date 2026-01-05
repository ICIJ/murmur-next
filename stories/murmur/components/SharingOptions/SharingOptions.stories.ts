import { SharingOptions } from '@/components'

export default {
  title: 'Murmur/components/SharingOptions/SharingOptions',
  component: SharingOptions,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse']
    }
  }
}

export const Default = {
  args: {}
}

export const WithUrl = {
  args: {
    url: 'https://www.icij.org/',
    class: 'justify-content-center'
  }
}

export const DirectionColumn = {
  args: {
    direction: 'column'
  }
}

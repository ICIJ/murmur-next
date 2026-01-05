import { FormEmbed } from '@/components'
import { SIZE } from '@/enums'
import { modalDecorator } from '../../decorators'

export default {
  title: 'Murmur/components/Form/FormEmbed',
  component: FormEmbed,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    class: 'card card-sm mx-auto my-4 pt-2'
  }
}

const embedUrl
  = 'https://projects.icij.org/the-implant-files/graphics/#/device-related-incidents-in-europe'

export const Default = {
  args: {
    noPreview: true,
    height: 330,
    url: embedUrl
  }
}

export const InModal = {
  args: {
    noTitle: true,
    height: 550,
    url: embedUrl
  },
  decorators: [
    modalDecorator.bind(null, 'Click to see the form with preview', 'Embed form with a preview', SIZE.lg)
  ]
}

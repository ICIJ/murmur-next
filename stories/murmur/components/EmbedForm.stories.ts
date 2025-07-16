import { EmbedForm } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'
import { modalDecorator } from '../decorators'
import { SIZE } from '@/enums'

export default {
  title: 'Murmur/components/EmbedForm',
  component: EmbedForm,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof EmbedForm>
const Template: Story = (args: any) => ({
  components: { EmbedForm },
  setup() {
    return { args }
  },
  template: '<EmbedForm v-bind="args" class="card card-sm mx-auto my-4 pt-2"/>'
})

export const Default = Template.bind({})
Default.args = {
  noPreview: true,
  height: 330,
  url: 'https://projects.icij.org/the-implant-files/graphics/#/device-related-incidents-in-europe'
}
export const InModal = Template.bind({})
InModal.decorators = [
  modalDecorator.bind(
    this,
    'Click to see the form with preview',
    'Embed form with a preview',
    SIZE.lg
  )
]
InModal.args = {
  noTitle: true,
  height: 550,
  url: 'https://projects.icij.org/the-implant-files/graphics/#/device-related-incidents-in-europe'
}

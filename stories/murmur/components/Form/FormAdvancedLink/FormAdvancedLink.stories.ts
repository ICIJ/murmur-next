import { FormAdvancedLink } from '@/components'
import { BCard } from 'bootstrap-vue-next'
import { StoryObj } from '@storybook/vue3-vite'
import { SIZE } from '@/enums'
import { modalDecorator, popoverDecorator } from '../../../decorators'

export default {
  components: { FormAdvancedLink },
  title: 'Murmur/components/Form/FormAdvancedLink/FormAdvancedLink',
  component: FormAdvancedLink,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof FormAdvancedLink>
const Template: Story = (args: any) => ({
  components: { FormAdvancedLink },
  setup() {
    return { args }
  },
  template: '<FormAdvancedLink v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  modelValue: 1,
  title: 'Medtronic spends millions each year on lobbying in the US',
  link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
  card: true,
  forms: ['markdown', 'html', 'raw']
}

export const InsideModal = Template.bind({})
InsideModal.decorators = [
  modalDecorator.bind(this, 'Click to see the form', 'Advanced Link', SIZE.md)
]
InsideModal.args = {
  title: 'Medtronic spends millions each year on lobbying in the US',
  link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
  card: true
}

export const InsidePopover = Template.bind({})
InsidePopover.decorators = [popoverDecorator]
InsidePopover.args = {
  title: 'Medtronic spends millions each year on lobbying in the US',
  link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
  card: true,
  small: true,
  noFade: true,
  forms: ['raw', 'markdown']
}

const tabPillsDecorator = () => ({
  components: { BCard },
  template: `<div class="text-center p-4">
        <b-card no-body>
            <story/>
        </b-card>
    </div>`
})
export const WithTabPills = Template.bind({})
WithTabPills.decorators = [tabPillsDecorator]
WithTabPills.args = {
  title: 'Medtronic spends millions each year on lobbying in the US',
  link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
  card: true,
  pills: true
}
export const WithTabPillsActiveClass = Template.bind({})
WithTabPillsActiveClass.decorators = [tabPillsDecorator]
WithTabPillsActiveClass.args = {
  title: 'Medtronic spends millions each year on lobbying in the US',
  link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
  card: true,
  pills: true,
  activeNavItemClass: 'bg-primary fw-bold'
}

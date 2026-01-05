import { FormAdvancedLink } from '@/components'
import { BCard } from 'bootstrap-vue-next'
import { SIZE } from '@/enums'
import { modalDecorator, popoverDecorator } from '../../../decorators'

export default {
  title: 'Murmur/components/Form/FormAdvancedLink/FormAdvancedLink',
  component: FormAdvancedLink,
  tags: ['autodocs'],
  argTypes: {}
}

const tabPillsDecorator = () => ({
  components: { BCard },
  template: `
    <div class="text-center p-4">
      <BCard no-body>
        <story/>
      </BCard>
    </div>
  `
})

export const Default = {
  args: {
    modelValue: 1,
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    forms: ['markdown', 'html', 'raw']
  }
}

export const InsideModal = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true
  },
  decorators: [modalDecorator.bind(null, 'Click to see the form', 'Advanced Link', SIZE.md)]
}

export const InsidePopover = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    small: true,
    noFade: true,
    forms: ['raw', 'markdown']
  },
  decorators: [popoverDecorator]
}

export const WithTabPills = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    pills: true
  },
  decorators: [tabPillsDecorator]
}

export const WithTabPillsActiveClass = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    pills: true,
    activeNavItemClass: 'bg-primary fw-bold'
  },
  decorators: [tabPillsDecorator]
}

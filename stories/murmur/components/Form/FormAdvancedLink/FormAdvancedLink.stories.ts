import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FormAdvancedLink } from '@/components'
import { BCard } from 'bootstrap-vue-next'
import { SIZE } from '@/enums'
import { modalDecorator, popoverDecorator } from '../../../decorators'

const meta: Meta<typeof FormAdvancedLink> = {
  title: 'Murmur/components/Form/FormAdvancedLink/FormAdvancedLink',
  component: FormAdvancedLink,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  args: {
    modelValue: 1,
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    forms: ['markdown', 'html', 'raw']
  }
}

export const InsideModal: Story = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true
  },
  decorators: [modalDecorator.bind(null, 'Click to see the form', 'Advanced Link', SIZE.md)]
}

export const InsidePopover: Story = {
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

export const WithTabPills: Story = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    pills: true
  },
  decorators: [tabPillsDecorator]
}

export const WithTabPillsActiveClass: Story = {
  args: {
    title: 'Medtronic spends millions each year on lobbying in the US',
    link: 'https://projects.icij.org/the-implant-files/graphics/#/medtronic-lobbying',
    card: true,
    pills: true,
    activeNavItemClass: 'bg-primary fw-bold'
  },
  decorators: [tabPillsDecorator]
}

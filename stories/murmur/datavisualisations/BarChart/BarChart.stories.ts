import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { BarChart } from '@/datavisualisations'

const meta: Meta<typeof BarChart> = {
  title: 'Murmur/datavisualisations/BarChart/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const breastImplantDecorator = () => ({
  template: `
    <h4>Breast implant patients kept in the dark about potential risks</h4>
    <p class="text-muted">
      More than 300 people around the world who responded to an ICIJ survey said they were not aware of the dangers of breast implants prior to their surgeries.
    </p>
    <story/>
  `
})

const dataWithHighlight = [
  { label: 'Warned about local complications', value: 52 },
  { label: 'Not warned', value: 42, highlight: true },
  { label: 'Warned thoroughly', value: 1 },
  { label: 'Other', value: 6 }
]

export const Default: Story = {
  args: {
    data: 'https://gist.githubusercontent.com/pirhoo/2308336d5f067ef7d84fec348fd63e29/raw/c0135f11e54e757187163dd0722b149a456c64b1/bars-icij-survey.json'
  },
  decorators: [breastImplantDecorator]
}

export const Highlight: Story = {
  args: {
    data: dataWithHighlight
  },
  decorators: [breastImplantDecorator]
}

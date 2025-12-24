import { LegendScale } from '@/components'
import { StoryObj } from '@storybook/vue3-vite'

import * as d3 from 'd3'
export default {
  title: 'Murmur/components/Legend/LegendScale',
  component: LegendScale,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof LegendScale>
const Template: Story = (args: any) => ({
  components: { LegendScale },
  setup() {
    return { args }
  },
  template: '<LegendScale v-bind="args" >{{args.default}}</LegendScale>'
})

export const Default = Template.bind({})
Default.args = {}
export const Width = Template.bind({})
Width.args = { width: '200' }
export const ColorScale = Template.bind({})
ColorScale.args = {
  colorScaleStart: '#fafa6e',
  colorScaleEnd: 'teal'
}

function thresholdScaleFn() {
  return (
    d3
      .scaleThreshold()
      .domain([1e4, 2e4, 3e4, 4e4, 5e4])
      // @ts-expect-error expect an array with numbers but hex color strings works
      .range(['#D12229', '#F68A1E', '#FDE01A', '#007940', '#24408E', '#732982'])
  )
}
export const ThresholdScale = Template.bind({})
ThresholdScale.args = {
  min: 0,
  max: 6e4,
  colorScale: thresholdScaleFn()
}
export const HighlightValue = Template.bind({})
HighlightValue.args = {
  width: 400,
  cursorValue: 46
}

export const CustomizedWithSlot: Story = (args: any) => ({
  components: { LegendScale },
  setup() {
    return { args }
  },
  template: `<LegendScale v-bind="args" ><template #cursor="{ value }">
        <div class="bg-dark text-light px-3 py-2">
            {{value}}
        </div>
    </template></LegendScale>`
})
CustomizedWithSlot.decorators = [
  () => ({ template: `<div style="margin:40px;"><story/></div>` })
]
CustomizedWithSlot.args = {
  width: 400,
  cursorValue: 10
}

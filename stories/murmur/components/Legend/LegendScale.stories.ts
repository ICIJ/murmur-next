import type { Meta, StoryObj } from '@storybook/vue3-vite'

import * as d3 from 'd3'
import { LegendScale } from '@/components'

const meta: Meta<typeof LegendScale> = {
  title: 'Murmur/components/Legend/LegendScale',
  component: LegendScale,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

function thresholdScaleFn() {
  return d3
    .scaleThreshold()
    .domain([1e4, 2e4, 3e4, 4e4, 5e4])
    // @ts-expect-error expect an array with numbers but hex color strings works
    .range(['#D12229', '#F68A1E', '#FDE01A', '#007940', '#24408E', '#732982'])
}

export const Default: Story = {
  args: {}
}

export const Width: Story = {
  args: { width: '200' }
}

export const ColorScale: Story = {
  args: {
    colorScaleStart: '#fafa6e',
    colorScaleEnd: 'teal'
  }
}

export const ThresholdScale: Story = {
  args: {
    min: 0,
    max: 6e4,
    colorScale: thresholdScaleFn()
  }
}

export const HighlightValue: Story = {
  args: {
    width: 400,
    cursorValue: 46
  }
}

export const CustomizedWithSlot: Story = {
  args: {
    width: 400,
    cursorValue: 10
  },
  decorators: [() => ({ template: '<div style="margin:40px;"><story/></div>' })],
  render: (args: any) => ({
    components: { LegendScale },
    setup: () => ({ args }),
    template: `
      <LegendScale v-bind="args">
        <template #cursor="{ value }">
          <div class="bg-dark text-light px-3 py-2">
            {{ value }}
          </div>
        </template>
      </LegendScale>
    `
  })
}

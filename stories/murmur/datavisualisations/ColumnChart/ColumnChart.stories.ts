import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'
import { ColumnChart } from '@/datavisualisations'
import { leakSizeDecorator } from '../../decorators'
import IPhInfo from '~icons/ph/info'

const meta: Meta<typeof ColumnChart> = {
  title: 'Murmur/datavisualisations/ColumnChart/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const dataUrl
  = 'https://gist.githubusercontent.com/pirhoo/259a1a5159db4a665d0c043fac71beef/raw/e74087b06cd12be2b2d3a8ca995730e38719cd4b/colums-incidents.json'

const discreteData = [
  { leak: 'Paradise Papers', size: 1.4 * 1e3 },
  { leak: 'Panama Papers', size: 2.6 * 1e3 },
  { leak: 'Swiss Leaks', size: 3.3 },
  { leak: 'LuxLeaks', size: 4 },
  { leak: 'Offshore Leaks', size: 260 }
]

const leakInjuriesDecorator = () => ({
  template: `
    <h4>Breast implant companies buried evidence of injuries for years</h4>
    <p class="text-muted">
      Incidents were reported as routine events that did not require public disclosure.
      After the U.S. Food and Drug Administration tightened enforcement of its reporting rules in 2017, reports of injuries soared.
    </p>
    <story/>
    <p class="text-muted small">
      Note: 2018 data includes January to June. Source: U.S. Food and Drug Administration, ICIJ analysis
    </p>
  `
})

export const Default: Story = {
  args: {
    data: dataUrl,
    xAxisTickCollapse: true,
    hover: true,
    hoverIcon: IPhInfo
  },
  decorators: [leakInjuriesDecorator]
}

export const TooltipSlot: Story = {
  args: {
    data: discreteData,
    seriesName: 'size',
    timeseriesKey: 'leak',
    yAxisYTicks: 4,
    maxValue: 3000
  },
  decorators: [leakSizeDecorator],
  render: (args: any) => ({
    components: { ColumnChart },
    setup: () => ({ args }),
    template: `
      <ColumnChart v-bind="args">
        <template #tooltip="{ datum: { size } }">
          {{ size }}GB
        </template>
      </ColumnChart>
    `
  })
}

export const DynamicHeight: Story = {
  args: {
    data: discreteData,
    seriesName: 'size',
    timeseriesKey: 'leak',
    yAxisYTicks: 4,
    maxValue: 3000,
    stripped: true,
    fixedHeight: 300
  }
}

const waterfallData = [
  { date: '2014', value: 55 },
  { date: '2015', value: 566 },
  { date: '2016', value: 1402 },
  { date: '2017', value: 3809 },
  { date: '2018', value: 7171 },
  { date: '2019', value: 11084 },
  { date: '2020', value: 14380 },
  { date: '2021', value: 17186 },
  { date: '2022', value: 20937 },
  { date: '2023', value: 25011 },
  { date: '2024', value: 29482 },
  { date: '2025', value: 31681 }
]

export const Waterfall: Story = {
  args: {
    data: waterfallData,
    waterfall: true,
    fixedHeight: 400,
    columnColor: '#e53935',
    yAxisTickFormat: ',d'
  }
}

export const WaterfallWithTotal: Story = {
  args: {
    data: waterfallData,
    waterfall: true,
    waterfallTotal: true,
    fixedHeight: 400,
    columnColor: '#e53935',
    yAxisTickFormat: ',d'
  }
}

export const DynamicData: Story = {
  render: () => ({
    components: { ColumnChart },
    setup() {
      const data = ref<{ date: string, value: number }[]>([])

      function generateData() {
        const newData: { date: string, value: number }[] = []
        const startYear = 1995 + ~~(Math.random() * 10)
        const groups = ~~(5 + Math.random() * 15)
        for (let g = 0; g < groups; g++) {
          newData.push({
            date: `${startYear + g}`,
            value: ~~(Math.random() * 100)
          })
        }
        data.value = newData
      }

      generateData()

      return { data, generateData }
    },
    template: `
      <button class="btn btn-primary" @click="generateData()">Randomize</button>
      <ColumnChart :data="data" :fixed-height="400" stripped />
    `
  })
}

import { ColumnChart } from '@/datavisualisations'
import { StoryObj } from '@storybook/vue3-vite'
import { leakSizeDecorator } from '../../decorators'

export default {
  title: 'Murmur/datavisualisations/ColumnChart/ColumnChart',
  component: ColumnChart,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof ColumnChart>
const Template: Story = (args: any) => ({
  components: { ColumnChart },
  setup() {
    return { args }
  },
  template: `
    <ColumnChart v-bind="args"/>`
})

const fixedHeight = 300
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
    Incidents were reported as routine events that did not require public disclosure. After the U.S. Food and Drug Administration tightened enforcement of its reporting rules in 2017, reports of injuries soared.
  </p>
  <story/>
  <p class="text-muted small">
    Note: 2018 data includes January to June. Source: U.S. Food and Drug Administration, ICIJ analysis
  </p>`
})
export const Default = Template.bind({})

Default.decorators = [leakInjuriesDecorator]
Default.args = {
  data: dataUrl,
  xAxisTickCollapse: true,
  hover: true,
  hoverIcon: 'info'
}

export const TooltipSlot: Story = (args: any) => ({
  components: { ColumnChart },
  setup() {
    return { args }
  },
  template: `
    <column-chart v-bind="args">
      <template #tooltip="{ datum: { size } }">
        {{ size }}GB
      </template>
    </column-chart>`
})

TooltipSlot.decorators = [leakSizeDecorator]

TooltipSlot.args = {
  data: discreteData,
  seriesName: 'size',
  timeseriesKey: 'leak',
  yAxisYTicks: 4,
  maxValue: 3000
}

export const DynamicHeight = TooltipSlot.bind({})

DynamicHeight.args = {
  data: discreteData,
  seriesName: 'size',
  timeseriesKey: 'leak',
  yAxisYTicks: 4,
  maxValue: 3000,
  stripped: true,
  fixedHeight: fixedHeight
}

export const DynamicData: Story = () => ({
  components: { ColumnChart },
  data() {
    return {
      data: [] as { date: string, value: number }[]
    }
  },
  beforeMount() {
    this.generateData()
  },
  methods: {
    generateData() {
      const data: { date: string, value: number }[] = []
      const startYear = 1995 + ~(Math.random() * 10)
      const groups = ~~(5 + Math.random() * 15)
      for (let g = 0; g < groups; g++) {
        const date = `${startYear + g}`
        const value = ~~(Math.random() * 100)
        data.push({ date, value })
      }
      this.data = data
    }
  },
  template: `
    <button class="btn btn-primary" @click="generateData()">
      Randomize
    </button>
    <column-chart :data="data" :fixed-height="400" stripped />
  `
})

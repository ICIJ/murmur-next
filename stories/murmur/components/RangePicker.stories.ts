import { RangePicker } from '@/components'
import { StoryObj } from '@storybook/vue3'
import { BBadge } from 'bootstrap-vue-next'
import { ColumnChart } from '../../../lib/main'
import { range } from 'lodash'
import { computed } from 'vue'

export default {
  title: 'Murmur/components/RangePicker',
  component: RangePicker,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof RangePicker>
const Template: Story = (args: any) => ({
  components: { RangePicker, BBadge },
  setup() {
    return { args }
  },
  template: `<RangePicker v-bind="args" ></RangePicker>`
})
export const Default = Template.bind({})
Default.decorators = [
  () => ({ template: `<div style="width:500px;"><story/></div>` })
]
Default.args = {
  range: [5, 10]
}

export const WithOffsets = (args: any) => ({
  components: { RangePicker, BBadge },
  setup() {
    return { args }
  },
  template: `
        <RangePicker v-bind="args" >
            <div class="bg-white p-3 text-center text-uppercase">
                <b-badge>{{ args.range[0] * 100 }}%</b-badge> - <b-badge>{{ args.range[1] * 100 }}%</b-badge>
            </div>
        </RangePicker>
    `
})
WithOffsets.args = {
  range: [5, 10]
}
export const WithColumnChart = (args: any) => ({
  components: { RangePicker, ColumnChart },
  setup() {
    const rangeStartYear = computed(() => {
      const start = args.rangeYears[0]
      const year = Math.ceil(start * (args.dataPerYear.length - 1))
      return args.dataPerYear[year].date
    })
    const rangeEndYear = computed(() => {
      const end = args.rangeYears[1]
      return args.dataPerYear[Math.floor(end * (args.dataPerYear.length - 1))]
        .date
    })
    const highlightedYears = computed(() => {
      return range(rangeStartYear.value, rangeEndYear.value + 1)
    })
    return { args, highlightedYears }
  },
  template: `
        <div class="bg-light p-5">
            <range-picker :snap="1 / args.dataPerYear.length" variant="dark" v-model:range="args.rangeYears" class="py-2" hover>
                <column-chart :bar-padding=0 :bar-margin=20 :highlights="highlightedYears" :data="args.dataPerYear" :fixed-height="200" no-y-axis no-tooltips />
            </range-picker>
        </div>

    `
})
WithColumnChart.args = {
  range: [0.2, 0.8],
  rangeYears: [0, 1 / 5],
  dataPerYear: [
    {
      date: 2018,
      value: 120
    },
    {
      date: 2019,
      value: 100
    },
    {
      date: 2020,
      value: 80
    },
    {
      date: 2021,
      value: 110
    },
    {
      date: 2022,
      value: 130
    }
  ]
}

import { LineChart } from '@/datavisualisations'
import { StoryObj } from '@storybook/vue3-vite'

export default {
  title: 'Murmur/datavisualisations/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof LineChart>
const Template: Story = (args: any) => ({
  components: { LineChart },
  setup() {
    return { args }
  },
  template: `<LineChart v-bind="args" />`
})

const dataUrl =
  'https://gist.githubusercontent.com/pirhoo/a2cdb6de5e3e816c0e9d80226806a688/raw/da3fdf3488d6bd68c6cfd9b89943b750ac65fd33/line-approvals.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = [
  {
    date: '1995',
    value: 284.1733871
  },
  {
    date: '1996',
    value: 262.2768595
  },
  {
    date: '1997',
    value: 196.8200456
  },
  {
    date: '1998',
    value: 162.8752475
  },
  {
    date: '1999',
    value: 136.9506399
  },
  {
    date: '2000',
    value: 124.3350877
  },
  {
    date: '2001',
    value: 125.4939024
  },
  {
    date: '2002',
    value: 122.1694656
  },
  {
    date: '2003',
    value: 111.5
  },
  {
    date: '2004',
    value: 127.8108974
  },
  {
    date: '2005',
    value: 96.66352624
  },
  {
    date: '2006',
    value: 94.98603352
  },
  {
    date: '2007',
    value: 104.7544803
  },
  {
    date: '2008',
    value: 100.3127517
  },
  {
    date: '2009',
    value: 96.34450402
  },
  {
    date: '2010',
    value: 85.1799458
  },
  {
    date: '2011',
    value: 96.70278777
  },
  {
    date: '2012',
    value: 88.19991705
  },
  {
    date: '2013',
    value: 79.83682187
  },
  {
    date: '2014',
    value: 78.45282258
  },
  {
    date: '2015',
    value: 84.64591978
  },
  {
    date: '2016',
    value: 79.61724542
  },
  {
    date: '2017',
    value: 68.62495399
  },
  {
    date: '2018',
    value: 67.30243261
  }
]
const leakDevicesDecorator = () => ({
  template: `
 <div class="d-flex align-items-baseline">
    <h4>
      High-risk devices are being approved faster in the US    
    </h4>
  </div>
  <p class="text-muted">
    The average time that it takes the Food and Drug Administration to review and approve a device through its pre-market approval process has dropped by more than 200 days since 1996.
  </p>
  <story/>
  <p class="text-muted small">
    Note: This chart shows the time, in days, between an application being received by the FDA and the device being approved. Source: U.S. Food and Drug Administration, ICIJ and AP analysis
  </p>`
})
export const Default = Template.bind({})
Default.decorators = [leakDevicesDecorator]
Default.args = {
  data: dataUrl
}

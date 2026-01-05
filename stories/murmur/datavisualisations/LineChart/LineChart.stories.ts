import { LineChart } from '@/datavisualisations'

export default {
  title: 'Murmur/datavisualisations/LineChart/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {}
}

const dataUrl
  = 'https://gist.githubusercontent.com/pirhoo/a2cdb6de5e3e816c0e9d80226806a688/raw/da3fdf3488d6bd68c6cfd9b89943b750ac65fd33/line-approvals.json'

const leakDevicesDecorator = () => ({
  template: `
    <div class="d-flex align-items-baseline">
      <h4>High-risk devices are being approved faster in the US</h4>
    </div>
    <p class="text-muted">
      The average time that it takes the Food and Drug Administration to review and approve a device through its pre-market approval process has dropped by more than 200 days since 1996.
    </p>
    <story/>
    <p class="text-muted small">
      Note: This chart shows the time, in days, between an application being received by the FDA and the device being approved. Source: U.S. Food and Drug Administration, ICIJ and AP analysis
    </p>
  `
})

export const Default = {
  args: { data: dataUrl },
  decorators: [leakDevicesDecorator]
}

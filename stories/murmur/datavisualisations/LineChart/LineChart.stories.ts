import type { Meta, StoryObj } from '@storybook/vue3-vite'

import * as d3 from 'd3'
import { LineChart } from '@/datavisualisations'

const meta: Meta<typeof LineChart> = {
  title: 'Murmur/datavisualisations/LineChart/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  args: { data: dataUrl },
  decorators: [leakDevicesDecorator]
}

const multiLineData = [
  { date: '2010', europe: 120, americas: 95, asia: 60 },
  { date: '2011', europe: 135, americas: 105, asia: 78 },
  { date: '2012', europe: 148, americas: 118, asia: 102 },
  { date: '2013', europe: 160, americas: 132, asia: 130 },
  { date: '2014', europe: 155, americas: 145, asia: 155 },
  { date: '2015', europe: 170, americas: 160, asia: 180 },
  { date: '2016', europe: 162, americas: 172, asia: 210 },
  { date: '2017', europe: 175, americas: 185, asia: 245 },
  { date: '2018', europe: 180, americas: 178, asia: 270 },
  { date: '2019', europe: 172, americas: 190, asia: 295 },
  { date: '2020', europe: 140, americas: 155, asia: 260 },
  { date: '2021', europe: 168, americas: 195, asia: 320 },
  { date: '2022', europe: 185, americas: 210, asia: 350 }
]

const multiLineDecorator = () => ({
  template: `
    <h4>Cross-border investigations by region</h4>
    <p class="text-muted">
      Number of cross-border investigations launched per year by region.
    </p>
    <story/>
    <p class="text-muted small">
      Source: Fictional data for illustration purposes
    </p>
  `
})

export const MultiLine: Story = {
  args: {
    data: multiLineData,
    keys: ['europe', 'americas', 'asia'],
    groups: ['Europe', 'Americas', 'Asia-Pacific'],
    lineColors: ['#e53935', '#1e88e5', '#43a047'],
    fixedHeight: 400
  },
  decorators: [multiLineDecorator]
}

export const MultiLineAutoColors: Story = {
  args: {
    data: multiLineData,
    keys: ['europe', 'americas', 'asia'],
    groups: ['Europe', 'Americas', 'Asia-Pacific'],
    fixedHeight: 400
  },
  decorators: [multiLineDecorator]
}

export const CurveStep: Story = {
  args: {
    data: multiLineData,
    keys: ['europe', 'americas', 'asia'],
    groups: ['Europe', 'Americas', 'Asia-Pacific'],
    lineColors: ['#e53935', '#1e88e5', '#43a047'],
    curve: d3.curveStep,
    fixedHeight: 400
  },
  decorators: [multiLineDecorator]
}

export const CurveMonotoneX: Story = {
  args: {
    data: multiLineData,
    keys: ['europe', 'americas', 'asia'],
    groups: ['Europe', 'Americas', 'Asia-Pacific'],
    lineColors: ['#e53935', '#1e88e5', '#43a047'],
    curve: d3.curveMonotoneX,
    fixedHeight: 400
  },
  decorators: [multiLineDecorator]
}

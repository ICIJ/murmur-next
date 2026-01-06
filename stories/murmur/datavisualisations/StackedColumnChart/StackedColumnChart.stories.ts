import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { StackedColumnChart } from '@/datavisualisations'
import { leakSizeDecorator } from '../../decorators'
import { humanReadableGb } from '../../utils'

const meta: Meta<typeof StackedColumnChart> = {
  title: 'Murmur/datavisualisations/StackedColumnChart/StackedColumnChart',
  component: StackedColumnChart,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

const incidentReportsUrl
  = 'https://gist.githubusercontent.com/pirhoo/4055e8d1ee3016805eaf1d2feabdd895/raw/a3d2ba8e9d19fcd9fc659dab50ec075248178238/stacked-colums-incidents.json'
const incidentReportsGroups = ['Deaths', 'Injuries', 'Malfunctions']

const icijStaff = [
  { city: 'Washington DC', developers: 1, journalists: 6, devops: 1, finance: 1 },
  { city: 'Paris ', developers: 5, journalists: 1, devops: 0, finance: 0 },
  { city: 'Madrid ', developers: 1, journalists: 0, devops: 4, finance: 0 },
  { city: 'New York City', developers: 0, journalists: 3, devops: 0, finance: 1 },
  { city: 'Sydney', developers: 0, journalists: 2, devops: 0, finance: 1 }
]

const leaksSize = [
  { leak: 'Offshore Leaks (2013)', size: 260 },
  { leak: 'Panama Papers (2016)', size: 2.6 * 1e3 },
  { leak: 'Paradise Papers (2017)', size: 1.4 * 1e3 }
]

const leakIncidentsDecorator = () => ({
  template: `
    <h4>Breast implant companies buried evidence of injuries for years</h4>
    <p class="text-muted">
      Incidents were reported as routine events that did not require public disclosure. After the FDA tightened enforcement of its reporting rules in 2017, reports of injuries soared.
    </p>
    <story/>
    <p class="text-muted small">Source: U.S. Food and Drug Administration, ICIJ analysis</p>
  `
})

const icijOfficesDecorator = () => ({
  template: `
    <h4>ICIJ Staff by office</h4>
    <p class="text-muted">As of April 2021. This list is more or less accurate.</p>
    <story/>
  `
})

export const Default: Story = {
  args: {
    data: incidentReportsUrl,
    groups: incidentReportsGroups,
    yAxisTickFormat: ',.0f'
  },
  decorators: [leakIncidentsDecorator]
}

export const NoDirectLabeling: Story = {
  args: {
    data: incidentReportsUrl,
    groups: incidentReportsGroups,
    noDirectLabeling: true
  },
  decorators: [leakIncidentsDecorator]
}

export const ColumnLabelField: Story = {
  args: {
    data: icijStaff,
    labelField: 'city'
  },
  decorators: [icijOfficesDecorator]
}

export const MaxValue: Story = {
  args: {
    data: icijStaff,
    hideEmptyValues: true,
    labelField: 'city',
    maxValue: 10
  },
  decorators: [icijOfficesDecorator]
}

export const NoTooltips: Story = {
  args: {
    data: icijStaff,
    noTooltips: true,
    hideEmptyValues: true,
    labelField: 'city',
    maxValue: 10
  },
  decorators: [icijOfficesDecorator]
}

export const SingleValueProp: Story = {
  args: {
    data: leaksSize,
    yAxisTickFormat: humanReadableGb,
    noTooltips: true,
    labelField: 'leak',
    maxValue: 3000
  },
  decorators: [leakSizeDecorator]
}

export const HideLegend: Story = {
  args: {
    data: leaksSize,
    yAxisTickFormat: humanReadableGb,
    noTooltips: true,
    labelField: 'leak',
    maxValue: 3000,
    hideLegend: true
  },
  decorators: [leakSizeDecorator]
}

export const BarMaxWidth: Story = {
  args: {
    data: leaksSize,
    yAxisTickFormat: humanReadableGb,
    noTooltips: true,
    labelField: 'leak',
    maxValue: 3000,
    barMaxWidth: '50%',
    hideLegend: true
  },
  decorators: [leakSizeDecorator]
}

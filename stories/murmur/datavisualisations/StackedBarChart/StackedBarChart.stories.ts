import { StackedBarChart } from '@/datavisualisations'
import { humanReadableGb } from '../../utils'

export default {
  title: 'Murmur/datavisualisations/StackedBarChart/StackedBarChart',
  component: StackedBarChart,
  tags: ['autodocs'],
  argTypes: {}
}

const incidentReports = [
  { label: 'Medtronic PLC', injury: 71444, death: 1828 },
  { label: 'Abbott Laboratories', injury: 40200, death: 2816 },
  { label: 'Johnson & Johnson', injury: 25863, death: 104 },
  { label: 'Boston Scientific', injury: 20509, death: 725 },
  { label: 'Zimmer Biomet Holdings', injury: 15733, death: 146 },
  { label: 'Tandem Diabetes Care, Inc.', injury: 13658, death: 26 },
  { label: 'Stryker', injury: 5102, death: 90 },
  { label: 'Becton, Dickinson and Company', injury: 3569, death: 130 },
  { label: 'DexCom, Inc.', injury: 1198, death: 25 },
  { label: 'Philips', injury: 450, death: 268 }
]

const leakSizes = [
  { label: 'Paradise Papers', value: 1.4 * 1e3 },
  { label: 'Panama Papers', value: 2.6 * 1e3 },
  { label: 'Swiss Leaks', value: 3.3 },
  { label: 'LuxLeaks', value: 4 },
  { label: 'Offshore Leaks', value: 260 }
]

const moviesUrl
  = 'https://gist.githubusercontent.com/pirhoo/20ce1b795555210c926967a291f8a7ad/raw/13d972b7d2b98b174c33fff38aac2b7d69c85fa7/stacked-bars-movies.json'
const movieGroups = ['Budget', 'Box Office']
const sortKeys = ['movie', 'budget', 'box_office']

const leakIncidentsDecorator = () => ({
  template: `
    <h4>Medical device companies reported tens of thousands of incidents in 2017</h4>
    <p class="text-muted">
      Companies must report when a patient has potentially been hurt or killed by one of their medical devices.
    </p>
    <story/>
    <p class="text-muted small">
      Note: The companies shown here are 10 of the biggest participants in the medical device industry.
      Numbers for Becton, Dickinson and Company include adverse events reported by C. R. Bard, which was acquired in 2017.
      Source: U.S. Food and Drug Administration, ICIJ analysis.
    </p>
  `
})

const leaksSizeDecorator = () => ({
  template: `
    <h4>Leaks size</h4>
    <p class="text-muted">Size of each leak in GB.</p>
    <story/>
  `
})

export const Default = {
  args: { data: incidentReports },
  decorators: [leakIncidentsDecorator]
}

export const LabelAbove = {
  args: {
    data: incidentReports,
    labelAbove: true
  },
  decorators: [leakIncidentsDecorator]
}

export const FixedHeightHideLegend = {
  args: {
    data: leakSizes,
    fixedHeight: 400,
    xAxisTickFormat: humanReadableGb,
    hideLegend: true
  },
  decorators: [leaksSizeDecorator]
}

export const HideEmptyValues = {
  args: {
    data: moviesUrl,
    labelField: 'movie',
    groups: movieGroups,
    hideEmptyValues: true
  }
}

export const SortByKey = {
  args: {
    data: moviesUrl,
    labelField: 'movie',
    sortBy: ['movie'],
    groups: movieGroups
  },
  argTypes: {
    sortBy: { control: 'select', options: sortKeys }
  }
}

export const RelativeValues = {
  args: {
    data: moviesUrl,
    labelField: 'movie',
    sortBy: ['movie'],
    groups: movieGroups,
    relative: true
  }
}

export const HeaderLeft = {
  args: {
    data: leakSizes,
    fixedHeight: 400,
    xAxisTickFormat: humanReadableGb,
    hideLegend: false
  },
  decorators: [leakIncidentsDecorator],
  render: (args: any) => ({
    components: { StackedBarChart },
    setup: () => ({ args }),
    template: `
      <StackedBarChart v-bind="args">
        <template #header-left>
          <h1>Header Left</h1>
        </template>
      </StackedBarChart>
    `
  })
}

export const HeaderRight = {
  args: {
    data: moviesUrl,
    labelField: 'movie',
    sortBy: ['movie'],
    hideEmptyValues: true,
    relative: true,
    groups: movieGroups,
    hideLegend: true
  },
  decorators: [leakIncidentsDecorator],
  argTypes: {
    sortBy: { control: 'select', options: sortKeys }
  },
  render: (args: any) => ({
    components: { StackedBarChart },
    setup: () => ({ args }),
    template: `
      <StackedBarChart v-bind="args">
        <template #header-right>
          <div class="ms-auto d-flex align-items-center p-0">
            <label class="m-2 d-flex align-items-center">
              Sort by {{ args.sortBy }}
            </label>
          </div>
        </template>
      </StackedBarChart>
    `
  })
}

import { SymbolMap } from '@/maps'
import { StoryObj } from '@storybook/vue3-vite'
import * as d3 from 'd3'

const icijOffices = [
  { latitude: 48.859116, longitude: 2.331839, category: 'Technology', label: 'Paris, France' },
  { latitude: 25.766368, longitude: -80.210268, category: 'Technology', label: 'Miami, FL, USA' },
  { latitude: 40.429913, longitude: -3.669245, category: 'Technology', label: 'Madrid, Spain' },
  { color: '#aff05b', latitude: 35.128683, longitude: -106.579128, category: 'Data', label: 'Alburquerque, USA' },
  { color: '#aff05b', latitude: 44.80401, longitude: 20.46513, category: 'Data', label: 'Belgrade, Serbia' },
  { color: '#aff05b', latitude: 53.33928, longitude: -6.281314, category: 'Data', label: 'Dublin, Ireland' },
  { latitude: -34.035875, longitude: 151.194191, category: 'Finance', label: 'Sydney, Australia' },
  { latitude: 18.2076699, longitude: -67.1463184, category: 'Finance', label: 'Puerto Rico' },
  { color: '#6e40aa', latitude: 38.9072, longitude: -77.0369, category: 'Editorial', label: 'Washington DC, USA' },
  { color: '#6e40aa', latitude: 47.4808722, longitude: 18.8501225, category: 'Editorial', label: 'Budapest, Hungary' }
]

const powerPlants = [
  { latitude: 53.85083, longitude: 9.34472, label: 'Brokdorf', reactors: 1, MWe: 1410, country: 'Germany' },
  { latitude: 39.80806, longitude: -5.69694, label: 'Almaraz', reactors: 2, MWe: 2017, country: 'Spain' },
  { latitude: 60.40333, longitude: 18.16667, label: 'Forsmark', reactors: 3, MWe: 3138, country: 'Sweden' },
  { latitude: 45.25583, longitude: -0.69306, label: 'Blayais', reactors: 4, MWe: 3640, country: 'France' },
  { latitude: 51.01528, longitude: 2.13611, label: 'Gravelines', reactors: 6, MWe: 5460, country: 'France' },
  { latitude: 41.2, longitude: 0.56944, label: 'Asco', reactors: 2, MWe: 1992, country: 'Spain' },
  { latitude: 47.50972, longitude: 2.875, label: 'Belleville', reactors: 2, MWe: 2620, country: 'France' },
  { latitude: 45.8, longitude: 5.27083, label: 'Bugey', reactors: 4, MWe: 3580, country: 'France' },
  { latitude: 49.41583, longitude: 6.21806, label: 'Cattenom', reactors: 4, MWe: 5200, country: 'France' },
  { latitude: 44.32222, longitude: 28.05722, label: 'Cernavoda', reactors: 2, MWe: 1300, country: 'Romania' },
  { latitude: 47.23056, longitude: 0.17056, label: 'Chinon', reactors: 4, MWe: 3620, country: 'France' },
  { latitude: 50.09, longitude: 4.78944, label: 'Chooz', reactors: 2, MWe: 3000, country: 'France' },
  { latitude: 46.45667, longitude: 0.65278, label: 'Civaux', reactors: 2, MWe: 2990, country: 'France' },
  { latitude: 39.21667, longitude: -1.05, label: 'Cofrentes', reactors: 1, MWe: 1064, country: 'Spain' },
  { latitude: 44.63306, longitude: 4.75667, label: 'Cruas', reactors: 4, MWe: 3660, country: 'France' },
  { latitude: 47.73306, longitude: 2.51667, label: 'Dampierre', reactors: 4, MWe: 3560, country: 'France' },
  { latitude: 51.32472, longitude: 4.25861, label: 'Doel', reactors: 4, MWe: 2911, country: 'Belgium' },
  { latitude: 49.085, longitude: 16.14889, label: 'Dukovany', reactors: 4, MWe: 2040, country: 'Czech Republic' },
  { latitude: 50.91389, longitude: 0.96389, label: 'Dungeness', reactors: 2, MWe: 1040, country: 'United Kingdom' },
  { latitude: 52.47417, longitude: 7.31778, label: 'Emsland', reactors: 1, MWe: 1329, country: 'Germany' },
  { latitude: 47.90306, longitude: 7.56306, label: 'Fessenheim', reactors: 2, MWe: 1760, country: 'France' },
  { latitude: 49.53639, longitude: -1.88167, label: 'Flamanville', reactors: 2, MWe: 2660, country: 'France' },
  { latitude: 44.10667, longitude: 0.84528, label: 'Golfech', reactors: 2, MWe: 2620, country: 'France' },
  { latitude: 52.03528, longitude: 9.41333, label: 'Grohnde', reactors: 1, MWe: 1360, country: 'Germany' },
  { latitude: 48.51472, longitude: 10.40222, label: 'Gundremmingen', reactors: 1, MWe: 1288, country: 'Germany' },
  { latitude: 54.635, longitude: -1.18083, label: 'Hartlepool', reactors: 2, MWe: 1190, country: 'United Kingdom' },
  { latitude: 54.02889, longitude: -2.91611, label: 'Heysham', reactors: 4, MWe: 2400, country: 'United Kingdom' },
  { latitude: 48.60556, longitude: 12.29306, label: 'Isar', reactors: 2, MWe: 1410, country: 'Germany' },
  { latitude: 50.30139, longitude: 26.64972, label: 'Khmelnitskiy', reactors: 2, MWe: 1900, country: 'Ukraine' },
  { latitude: 43.74611, longitude: 23.77056, label: 'Kozloduy', reactors: 2, MWe: 1906, country: 'Bulgaria' },
  { latitude: 47.60306, longitude: 8.18472, label: 'Leibstadt', reactors: 1, MWe: 1190, country: 'Switzerland' },
  { latitude: 49.04167, longitude: 9.175, label: 'Neckarwestheim', reactors: 2, MWe: 1310, country: 'Germany' },
  { latitude: 48.51528, longitude: 3.51778, label: 'Nogent', reactors: 2, MWe: 2620, country: 'France' },
  { latitude: 61.23694, longitude: 21.44083, label: 'Olkiluoto', reactors: 2, MWe: 1740, country: 'Finland' },
  { latitude: 57.41556, longitude: 16.67111, label: 'Oskarshamn', reactors: 1, MWe: 1400, country: 'Sweden' },
  { latitude: 46.5725, longitude: 18.85417, label: 'Paks', reactors: 4, MWe: 1889, country: 'Hungary' },
  { latitude: 49.85806, longitude: 0.63556, label: 'Paluel', reactors: 4, MWe: 5320, country: 'France' },
  { latitude: 49.97667, longitude: 1.21194, label: 'Penly', reactors: 2, MWe: 2660, country: 'France' },
  { latitude: 49.2525, longitude: 8.43639, label: 'Philippsburg', reactors: 2, MWe: 1402, country: 'Germany' },
  { latitude: 57.25972, longitude: 12.11083, label: 'Ringhals', reactors: 4, MWe: 3649, country: 'Sweden' },
  { latitude: 51.32778, longitude: 25.89167, label: 'Rivne', reactors: 4, MWe: 2645, country: 'Ukraine' },
  { latitude: 45.40444, longitude: 4.75444, label: 'Saint-Alban', reactors: 2, MWe: 2670, country: 'France' },
  { latitude: 47.72, longitude: 1.5775, label: 'Saint-Laurent', reactors: 2, MWe: 1830, country: 'France' },
  { latitude: 52.21333, longitude: 1.61861, label: 'Sizewell-B', reactors: 1, MWe: 1188, country: 'United Kingdom' },
  { latitude: 47.81667, longitude: 31.21667, label: 'South Ukraine', reactors: 3, MWe: 2850, country: 'Ukraine' },
  { latitude: 49.18, longitude: 14.37611, label: 'Temelin', reactors: 2, MWe: 1926, country: 'Czech Republic' },
  { latitude: 50.53472, longitude: 5.2725, label: 'Tihange', reactors: 3, MWe: 3016, country: 'Belgium' },
  { latitude: 55.96806, longitude: -2.40917, label: 'Torness', reactors: 2, MWe: 1205, country: 'United Kingdom' },
  { latitude: 44.32972, longitude: 4.73222, label: 'Tricastin', reactors: 4, MWe: 3660, country: 'France' },
  { latitude: 40.70111, longitude: -2.62194, label: 'Trillo', reactors: 1, MWe: 1003, country: 'Spain' },
  { latitude: 40.95139, longitude: 0.86667, label: 'Vandellos', reactors: 1, MWe: 1045, country: 'Spain' },
  { latitude: 47.51222, longitude: 34.58583, label: 'Zaporizhzhia', reactors: 6, MWe: 5700, country: 'Ukraine' }
]

const powerPlantMarkerPath = 'M 143.97,136.52 144,153 H 0 V 137 C 18.15,94.8 28.98,48.61 30,0 h 84 c 1.01,48.36 11.98,94.49 29.97,136.52 z'

function powerPlantMarkerWidth(data: typeof powerPlants) {
  const scale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.MWe) as [number, number])
    .range([5, 20])
  return (d: { MWe: number }) => scale(d.MWe)
}

export default {
  title: 'Murmur/maps/SymbolMap',
  component: SymbolMap,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    horizontalLegend: { control: 'boolean' },
    zoomable: { control: 'boolean' },
    fitToMarkers: { control: 'boolean' },
    hideLegend: { control: 'boolean' },
    hideTooltip: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component: `
The \`SymbolMap\` component displays markers on a map based on geographic coordinates.
It supports custom marker shapes, colors, sizes, and interactive features like zooming and tooltips.

## Data Structure

The component expects an array of objects with at least \`latitude\` and \`longitude\` properties:

\`\`\`javascript
[
  { latitude: 48.859116, longitude: 2.331839, category: 'Technology', label: 'Paris, France' },
  { latitude: 25.766368, longitude: -80.210268, category: 'Technology', label: 'Miami, FL, USA' },
  // Optional: add 'color' property to override the default category color
  { color: '#aff05b', latitude: 35.128683, longitude: -106.579128, category: 'Data', label: 'Alburquerque, USA' }
]
\`\`\`
        `
      }
    }
  }
}

type Story = StoryObj<typeof SymbolMap>

export const Default: Story = {
  args: {
    data: icijOffices,
    horizontalLegend: true,
    zoomable: true
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `
      <div class="bg-white p-4">
        <h4>ICIJ Offices</h4>
        <p class="mb-4">A non-exhaustive list of ICIJ offices and operations.</p>
        <SymbolMap v-bind="args">
          <template #tooltip="{ category, label }">
            {{ label }} - {{ category }}
          </template>
        </SymbolMap>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'A basic example showing ICIJ office locations around the world with category-based coloring.'
      }
    }
  }
}

export const NuclearPowerPlants: Story = {
  args: {
    data: powerPlants,
    markerPath: powerPlantMarkerPath,
    markerWidth: powerPlantMarkerWidth(powerPlants),
    categoryObjectsPath: 'reactors',
    fitToMarkers: true,
    horizontalLegend: true,
    tooltipPlacement: 'right'
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `
      <div class="bg-white p-4">
        <h4>Nuclear Power Plants in Europe</h4>
        <SymbolMap v-bind="args" class="power-plants-map">
          <template #tooltip="{ country, label, MWe }">
            <div class="text-left p-1">
              <h6 class="mb-1">{{ label }} ({{ country }})</h6>
              <strong class="h5">{{ MWe }} MWe</strong>
            </div>
          </template>
          <template #legend-label="{ label }">
            <span v-if="label === '1'">1 reactor</span>
            <span v-else>{{ label }} reactors</span>
          </template>
        </SymbolMap>
        <p class="text-end mt-2 mb-0">
          <small><a href="https://pris.iaea.org/PRIS/" target="_blank">Source: IAEA PRIS</a></small>
        </p>
      </div>
      <style>
        .power-plants-map.symbol-map {
          --category-color-0n: #ffeda0;
          --category-color-1n: #fed976;
          --category-color-2n: #feb24c;
          --category-color-3n: #fd8d3c;
          --category-color-4n: #fc4e2a;
          --category-color-5n: #e31a1c;
          --category-color-6n: #b10026;
          --category-color-7n: #630015;
        }
      </style>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: `
A more advanced example with custom marker shapes and sizes based on data values.

The marker width is dynamically calculated based on the power output (MWe), and custom CSS variables are used to define category colors based on the number of reactors.

**Custom Marker Path:** A cooling tower shape is used instead of the default circle.

**Dynamic Marker Width:** The size scales with the power plant's output.
        `
      }
    }
  }
}

export const Marseille: Story = {
  args: {
    data: 'https://gist.githubusercontent.com/pirhoo/c42b180b774177bd9882899e009dddbe/raw/marseille-sport-facilities.json',
    markerWidth: 7,
    fitToMarkers: true,
    horizontalLegend: true,
    topojsonObjects: 'collection',
    topojsonUrl: 'https://gist.githubusercontent.com/pirhoo/a734b72bcf69f81f034b676e0aac4788/raw/marseille.topojson'
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `
      <div class="bg-white p-4">
        <h4>Sport Facilities in Marseille</h4>
        <p>Every sport facility administered by the city of Marseille.</p>
        <SymbolMap v-bind="args" class="marseille-facilities-map">
          <template #tooltip="{ name }">
            {{ name }}
          </template>
        </SymbolMap>
        <p class="text-end mt-2 mb-0">
          <small><a href="https://trouver.datasud.fr/dataset/marseille-equipements-sportifs" target="_blank">Source: DataSud</a></small>
        </p>
      </div>
      <style>
        .marseille-facilities-map.symbol-map :deep(.symbol-map__main__features__item) {
          stroke: #ccc;
        }
      </style>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: `
Just like the \`ChoroplethMap\`, the \`SymbolMap\` can use a different TopoJSON to generate its base layer.

This example loads:
- **Data:** Sport facilities from a remote JSON file
- **Base map:** A custom TopoJSON of Marseille districts
        `
      }
    }
  }
}

export const Zoomable: Story = {
  args: {
    data: icijOffices,
    horizontalLegend: true,
    zoomable: true
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `<div class="bg-light p-4"><SymbolMap v-bind="args" /></div>`
  }),
  parameters: {
    docs: {
      description: {
        story: 'Enable zooming and panning on the map with the `zoomable` prop.'
      }
    }
  }
}

export const FitToMarkers: Story = {
  args: {
    data: powerPlants,
    fitToMarkers: true,
    horizontalLegend: true,
    categoryObjectsPath: 'country'
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `<div class="bg-light p-4"><SymbolMap v-bind="args" /></div>`
  }),
  parameters: {
    docs: {
      description: {
        story: 'Use `fitToMarkers` to automatically zoom the map to fit all markers.'
      }
    }
  }
}

export const HiddenLegend: Story = {
  args: {
    data: icijOffices,
    hideLegend: true
  },
  render: args => ({
    components: { SymbolMap },
    setup() {
      return { args }
    },
    template: `<div class="bg-light p-4"><SymbolMap v-bind="args" /></div>`
  }),
  parameters: {
    docs: {
      description: {
        story: 'Hide the legend with `hideLegend` prop.'
      }
    }
  }
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ChoroplethMap, ChoroplethMapAnnotation } from '@/maps'
import { scaleThreshold } from 'd3'
import { geoOrthographic } from 'd3-geo'
import { motorVehiclesPer1000people, wineStockByDepartment } from '../fixtures'
import { bgPolkaDecorator } from '../../decorators'

const meta: Meta<typeof ChoroplethMap> = {
  title: 'Murmur/maps/ChoroplethMap/ChoroplethMap',
  component: ChoroplethMap,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object' },
    hatchEmpty: { control: 'boolean' },
    zoomable: { control: 'boolean' },
    clickable: { control: 'boolean' },
    hideLegend: { control: 'boolean' }
  },
  decorators: [bgPolkaDecorator],
  parameters: {
    docs: {
      description: {
        component: `
The \`ChoroplethMap\` component creates thematic maps where areas are shaded based on data values.

## Data Structure

Pass an object with region identifiers as keys (ISO3 codes for world maps) and numeric values:

\`\`\`javascript
{
  FRA: 578,  // France
  DEU: 572,  // Germany
  USA: 797,  // United States
  // ...
}
\`\`\`

## Custom TopoJSON

You can use different TopoJSON files to create maps of specific regions (countries, departments, etc.)
by configuring \`topojsonUrl\`, \`topojsonObjects\`, and \`topojsonObjectsPath\`.
        `
      }
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

function featureColorScale() {
  return scaleThreshold<number, string>()
    .domain([100, 300, 700])
    .range(['#ffffcc', '#c2e699', '#78c679', '#238443'])
}

export const Default: Story = {
  args: {
    data: motorVehiclesPer1000people,
    hatchEmpty: true,
    zoomable: true
  },
  render: (args: any) => ({
    components: { ChoroplethMap },
    setup: () => ({ args }),
    template: `
      <h4 class="mb-4">Motor vehicles per 1000 people</h4>
      <ChoroplethMap v-bind="args" />
      <p class="text-end mt-2 mb-0">
        <small><a href="https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita" target="_blank">Source: Wikipedia</a></small>
      </p>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'A world map showing motor vehicles per 1000 people by country. Uses ISO3 country codes as identifiers.'
      }
    }
  }
}

export const CustomColorScale: Story = {
  args: {
    data: motorVehiclesPer1000people,
    featureColorScale: featureColorScale()
  },
  render: (args: any) => ({
    components: { ChoroplethMap },
    setup: () => ({ args }),
    template: `
      <h4 class="mb-4">Motor vehicles per 1000 people</h4>
      <ChoroplethMap v-bind="args" />
      <p class="text-end mt-2 mb-0">
        <small><a href="https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita" target="_blank">Source: Wikipedia</a></small>
      </p>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: `
Use a custom D3 scale function to colorize the map features:

\`\`\`javascript
import { scaleThreshold } from 'd3'

const featureColorScale = scaleThreshold()
  .domain([100, 300, 700])
  .range(['#ffffcc', '#c2e699', '#78c679', '#238443'])
\`\`\`
        `
      }
    }
  }
}

export const FrenchDepartments: Story = {
  args: {
    data: wineStockByDepartment,
    clickable: true,
    zoomable: true,
    topojsonUrl: './assets/topojson/france-departments.json',
    topojsonObjects: 'departements',
    topojsonObjectsPath: 'properties.code'
  },
  render: (args: any) => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup: () => ({ args }),
    template: `
      <h4>Wine stocks (hectoliters) by French Department</h4>
      <p>Commercial stocks of wine for each French department in August 2016.</p>
      <ChoroplethMap v-bind="args">
        <template #legend-cursor="{ value }">
          <div class="bg-dark text-light px-2 py-1 text-nowrap">
            {{ value.toLocaleString() }} hl
          </div>
        </template>
        <ChoroplethMapAnnotation :latitude="44.836151" :longitude="-0.580816" placement="righttop" class="text-center">
          Bordeaux<br /><small>▼</small>
        </ChoroplethMapAnnotation>
      </ChoroplethMap>
      <p class="text-end mt-2 mb-0">
        <small><a href="https://www.data.gouv.fr/fr/datasets/campagnes-viti-vinicoles-depuis-2011/" target="_blank">Source: data.gouv.fr</a></small>
      </p>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: `
Use a different TopoJSON to build maps of specific regions. This example shows French departments with wine stock data.

Configure the TopoJSON source with:
- \`topojsonUrl\`: Path to the TopoJSON file
- \`topojsonObjects\`: Name of the objects collection in the TopoJSON
- \`topojsonObjectsPath\`: Property path to match with your data keys
        `
      }
    }
  }
}

export const SphericalProjection: Story = {
  args: {
    center: [33.435499, 35.167406],
    projection: geoOrthographic,
    zoomMin: 0.9,
    color: '#aaf',
    outlineColor: 'var(--bs-body-color)',
    graticuleColor: 'var(--bs-border-color-translucent)',
    graticule: true,
    hideLegend: true,
    outline: true,
    spherical: true,
    zoomable: true
  },
  render: (args: any) => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup: () => ({ args }),
    template: `
      <ChoroplethMap v-bind="args">
        <ChoroplethMapAnnotation
          :latitude="35.167406"
          :longitude="33.435499"
          :height="15"
          :width="15"
          class="text-center"
          drop-shadow="none"
          scale
        >
          <div class="border border-warning" style="height: 15px; width: 15px"></div>
        </ChoroplethMapAnnotation>
      </ChoroplethMap>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: `
Use a custom D3 projection for different map views. This example uses \`geoOrthographic\` for a globe-like appearance.

\`\`\`javascript
import { geoOrthographic } from 'd3-geo'

// Props
{
  projection: geoOrthographic,
  spherical: true,
  graticule: true,
  outline: true
}
\`\`\`
        `
      }
    }
  }
}

export const HatchEmpty: Story = {
  args: {
    data: motorVehiclesPer1000people,
    hatchEmpty: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `hatchEmpty` to show a pattern on countries with no data.'
      }
    }
  }
}

export const Zoomable: Story = {
  args: {
    data: motorVehiclesPer1000people,
    hatchEmpty: true,
    zoomable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Enable zoom and pan with the `zoomable` prop.'
      }
    }
  }
}

export const Clickable: Story = {
  args: {
    data: wineStockByDepartment,
    clickable: true,
    zoomable: true,
    topojsonUrl: './assets/topojson/france-departments.json',
    topojsonObjects: 'departements',
    topojsonObjectsPath: 'properties.code'
  },
  parameters: {
    docs: {
      description: {
        story: 'Enable clicking on features to zoom with the `clickable` prop.'
      }
    }
  }
}

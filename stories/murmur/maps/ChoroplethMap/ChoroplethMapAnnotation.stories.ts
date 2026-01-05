import { ChoroplethMap, ChoroplethMapAnnotation } from '@/maps'
import { StoryObj } from '@storybook/vue3-vite'
import { geoOrthographic } from 'd3-geo'
import { scaleSequential } from 'd3'

const offices = [
  { latitude: 48.859116, longitude: 2.331839, label: 'Paris, France' },
  { latitude: 25.766368, longitude: -80.210268, label: 'Miami, FL, USA' },
  { latitude: 40.429913, longitude: -3.669245, label: 'Madrid, Spain' },
  { latitude: 35.128683, longitude: -106.579128, label: 'Alburquerque, USA' },
  { latitude: 44.80401, longitude: 20.46513, label: 'Belgrade, Serbia' },
  { latitude: 53.33928, longitude: -6.281314, label: 'Dublin, Ireland' },
  { latitude: -34.035875, longitude: 151.194191, label: 'Sydney, Australia' },
  { latitude: 38.9072, longitude: -77.0369, label: 'Washington DC, USA' }
]

const swimmingPoolsByArrondissement: Record<string, number> = {
  1: 1,
  4: 1,
  5: 1,
  6: 1,
  8: 1,
  9: 2,
  10: 1,
  11: 2,
  12: 2,
  13: 4,
  14: 3,
  15: 7,
  16: 1,
  17: 1,
  18: 2,
  19: 4,
  20: 3
}

const swimmingPools = [
  { name: 'Piscine Henry de Montherlant', ar: 16, latitude: 48.86729079, longitude: 2.271528354, m50: false },
  { name: 'Piscine Jean Taris', ar: 5, latitude: 48.84476225, longitude: 2.347867188, m50: false },
  { name: 'Piscine Georges Hermant', ar: 19, latitude: 48.88236232, longitude: 2.389479392, m50: true },
  { name: 'Piscine Roger Le Gall', ar: 12, latitude: 48.84165419, longitude: 2.412576407, m50: true },
  { name: 'Piscine Suzanne Berlioux', ar: 1, latitude: 48.86179397, longitude: 2.347164561, m50: true },
  { name: 'Piscine Blomet', ar: 15, latitude: 48.84330516, longitude: 2.307503743, m50: true },
  { name: 'Piscine Georges-Vallerey', ar: 20, latitude: 48.87548869, longitude: 2.406729763, m50: true },
  { name: 'Piscine Keller', ar: 15, latitude: 48.84738721, longitude: 2.282124901, m50: true },
  { name: 'Piscine Champerret', ar: 17, latitude: 48.888621, longitude: 2.295487774, m50: false },
  { name: 'Piscine Rouvet', ar: 19, latitude: 48.89308109, longitude: 2.384807396, m50: false },
  { name: 'Piscine Butte aux Cailles', ar: 13, latitude: 48.82691355, longitude: 2.352891856, m50: false },
  { name: 'Piscine Josephine-Baker', ar: 13, latitude: 48.83606521, longitude: 2.376165739, m50: false }
]

const swimmingPoolsColorScale = scaleSequential([0, 7], ['#fff', '#00f'])

const wineStockByDepartment: Record<string, number> = {
  33: 2416742, 34: 856268, 11: 207334
}

export default {
  title: 'Murmur/maps/ChoroplethMap/ChoroplethMapAnnotation',
  component: ChoroplethMapAnnotation,
  tags: ['autodocs'],
  argTypes: {
    latitude: { control: 'number' },
    longitude: { control: 'number' },
    placement: {
      control: 'select',
      options: [null, 'top', 'topleft', 'topright', 'right', 'righttop', 'rightbottom', 'bottom', 'bottomleft', 'bottomright', 'left', 'lefttop', 'leftbottom']
    },
    height: { control: 'number' },
    width: { control: 'number' },
    scale: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component: `
The \`ChoroplethMapAnnotation\` component must be used as a child of a \`ChoroplethMap\` component.
It allows you to add custom annotations at specific geographic coordinates.

## Usage

\`\`\`vue
<ChoroplethMap :data="data">
  <ChoroplethMapAnnotation :latitude="48.8566" :longitude="2.3522" placement="top">
    Paris
  </ChoroplethMapAnnotation>
</ChoroplethMap>
\`\`\`

## Placement Options

- \`null\` (centered)
- \`top\`, \`topleft\`, \`topright\`
- \`bottom\`, \`bottomleft\`, \`bottomright\`
- \`left\`, \`lefttop\`, \`leftbottom\`
- \`right\`, \`righttop\`, \`rightbottom\`
        `
      }
    }
  }
}

type Story = StoryObj<typeof ChoroplethMapAnnotation>

export const Spherical: Story = {
  render: () => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup() {
      return { offices, geoOrthographic }
    },
    template: `
      <div class="bg-light p-4">
        <h4>ICIJ Offices</h4>
        <p class="mb-4">A non-exhaustive list of ICIJ offices and operations.</p>
        <ChoroplethMap
          color="#faa"
          outline-color="#000"
          graticule-color="#eee"
          graticule
          outline
          hide-legend
          zoomable
          spherical
          :zoom-min="0.9"
          :projection="geoOrthographic"
        >
          <ChoroplethMapAnnotation :latitude="38.9072" :longitude="-77.0369" placement="top">
            <p class="small mb-2">Washington DC (Headquarter)</p>
          </ChoroplethMapAnnotation>
          <ChoroplethMapAnnotation
            v-for="(office, o) in offices"
            :key="o"
            :latitude="office.latitude"
            :longitude="office.longitude"
          >
            <span :title="office.label">●</span>
          </ChoroplethMapAnnotation>
        </ChoroplethMap>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Annotations work with spherical projections. Rotate the globe to see how annotations stay attached to their coordinates.'
      }
    }
  }
}

export const ParisSwimmingPools: Story = {
  render: () => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup() {
      const pools50m = swimmingPools.filter(p => p.m50)
      const poolsRegular = swimmingPools.filter(p => !p.m50)
      return {
        swimmingPoolsByArrondissement,
        swimmingPoolsColorScale,
        pools50m,
        poolsRegular
      }
    },
    template: `
      <div class="bg-light p-4">
        <h4>Paris Public Swimming Pools</h4>
        <p class="mb-4">Only 6 are olympic-size swimming pools (50m).</p>
        <ChoroplethMap
          :data="swimmingPoolsByArrondissement"
          :feature-color-scale="swimmingPoolsColorScale"
          topojson-url="./assets/topojson/paris-arrondissements.json"
          topojson-objects="arrondissements"
          topojson-objects-path="properties.ar"
        >
          <ChoroplethMapAnnotation
            v-for="(pool, i) in poolsRegular"
            :key="'regular-' + i"
            :latitude="pool.latitude"
            :longitude="pool.longitude"
          >
            <span :title="pool.name">●</span>
          </ChoroplethMapAnnotation>
          <ChoroplethMapAnnotation
            v-for="(pool, i) in pools50m"
            :key="'50m-' + i"
            :latitude="pool.latitude"
            :longitude="pool.longitude"
            placement="topright"
          >
            <div class="ps-1 small text-start">
              {{ pool.name.replace('Piscine ', '') }}<br />
              <small>▼</small>
            </div>
          </ChoroplethMapAnnotation>
        </ChoroplethMap>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Combine annotations with different placements. Regular pools show as dots, while 50m pools have labels with `topright` placement.'
      }
    }
  }
}

export const BasicAnnotation: Story = {
  args: {
    latitude: 44.836151,
    longitude: -0.580816,
    placement: 'righttop'
  },
  render: args => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup() {
      return { args, wineStockByDepartment }
    },
    template: `
      <div class="bg-light p-4">
        <ChoroplethMap
          :data="wineStockByDepartment"
          topojson-url="./assets/topojson/france-departments.json"
          topojson-objects="departements"
          topojson-objects-path="properties.code"
          zoomable
        >
          <ChoroplethMapAnnotation v-bind="args">
            <div class="text-center">
              <strong>Bordeaux</strong><br />
              <small>Wine Region</small>
            </div>
          </ChoroplethMapAnnotation>
        </ChoroplethMap>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'A simple annotation pointing to Bordeaux on a French departments map.'
      }
    }
  }
}

export const ScaleWithZoom: Story = {
  render: () => ({
    components: { ChoroplethMap, ChoroplethMapAnnotation },
    setup() {
      return { geoOrthographic }
    },
    template: `
      <div class="bg-dark p-4">
        <ChoroplethMap
          :center="[33.435499, 35.167406]"
          :projection="geoOrthographic"
          :zoom-min="0.9"
          color="#aaf"
          outline-color="var(--bs-body-color)"
          graticule-color="var(--bs-border-color-translucent)"
          graticule
          hide-legend
          outline
          spherical
          zoomable
        >
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
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Use `scale` prop to make the annotation scale with the map zoom level.'
      }
    }
  }
}

import { ChoroplethMap, ChoroplethMapAnnotation } from '@/maps'
import { StoryObj } from '@storybook/vue3-vite'

const wineStockByDepartment = {
  '33': 2416742,
  '34': 856268,
  '11': 207334,
  '30': 168319,
  '83': 160518,
  '84': 218890,
  '66': 80076,
  '13': 1699268
}

export default {
  title: 'Murmur/maps/ChoroplethMapAnnotation',
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
  }
}

type Story = StoryObj<typeof ChoroplethMapAnnotation>

const Template: Story = (args: any) => ({
  components: { ChoroplethMap, ChoroplethMapAnnotation },
  setup() {
    return { args, wineStockByDepartment }
  },
  template: `
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
    </ChoroplethMap>`
})

export const Default = Template.bind({})
Default.args = {
  latitude: 44.836151,
  longitude: -0.580816,
  placement: 'righttop'
}

export const Centered = Template.bind({})
Centered.args = {
  latitude: 44.836151,
  longitude: -0.580816,
  placement: null
}

export const ScaleWithZoom = Template.bind({})
ScaleWithZoom.args = {
  latitude: 44.836151,
  longitude: -0.580816,
  placement: 'righttop',
  scale: true
}

import { ChoroplethMap, ChoroplethMapAnnotation } from '@/maps'
import { StoryObj } from '@storybook/vue3'
import { scaleThreshold } from 'd3'
import { geoOrthographic } from 'd3-geo'
const motorVehiclesPer1000people = {
  MCO: 899,
  USA: 797,
  LIE: 750,
  ISL: 745,
  LUX: 739,
  AUS: 717,
  NZL: 712,
  MLT: 693,
  ITA: 679,
  GUM: 677,
  PRI: 635,
  GRC: 624,
  FIN: 612,
  CAN: 607,
  ESP: 593,
  JPN: 591,
  NOR: 584,
  FRA: 578,
  AUT: 578,
  DEU: 572,
  SVN: 567,
  CHE: 566,
  LTU: 560,
  BEL: 559,
  PRT: 548,
  BHR: 537,
  POL: 537,
  QAT: 532,
  CYP: 532,
  NLD: 528,
  KWT: 527,
  SWE: 520,
  GBR: 519,
  IRL: 513,
  BRN: 510,
  CZE: 485,
  DNK: 480,
  EST: 476,
  BRB: 469,
  LBN: 434,
  BGR: 393,
  HRV: 380,
  KOR: 376,
  SVK: 364,
  BLR: 362,
  MYS: 361,
  TTO: 353,
  ISR: 346,
  HUN: 345,
  SAU: 336,
  TWN: 324,
  LVA: 319,
  ARG: 314,
  ARE: 313,
  MNE: 309,
  RUS: 293,
  SUR: 291,
  LBY: 290,
  MEX: 275,
  BRA: 249,
  SRB: 238,
  ROU: 235,
  ATG: 230,
  KNA: 223,
  KAZ: 219,
  OMN: 215,
  BIH: 214,
  THA: 206,
  VCT: 204,
  IRN: 200,
  URY: 200,
  JAM: 188,
  CHL: 184,
  FJI: 179,
  CRI: 177,
  SYC: 176,
  MUS: 175,
  BLZ: 174,
  TON: 174,
  UKR: 173,
  LCA: 166,
  JOR: 165,
  ZAF: 165,
  DMA: 163,
  NRU: 159,
  MDA: 156,
  GEO: 155,
  MKD: 155,
  SGP: 149,
  VEN: 147,
  KIR: 146,
  TUR: 144,
  BWA: 133,
  PAN: 132,
  DOM: 128,
  TUN: 125,
  ALB: 124,
  GRD: 122,
  ZWE: 114,
  DZA: 114,
  NAM: 107,
  TKM: 106,
  ARM: 103,
  CPV: 101,
  AZE: 101,
  GUY: 95,
  HND: 95,
  SLV: 94,
  SWZ: 89,
  CHN: 83,
  BHS: 81,
  HKG: 77,
  WSM: 77,
  LKA: 76,
  SYR: 73,
  PER: 73,
  MNG: 72,
  ECU: 71,
  COL: 71,
  MAR: 70,
  BOL: 68,
  GTM: 68,
  IDN: 60,
  KGZ: 59,
  NIC: 57,
  BTN: 57,
  VUT: 54,
  PRY: 54,
  IRQ: 50,
  EGY: 45,
  PSE: 42,
  TJK: 38,
  CUB: 38,
  AGO: 38,
  UZB: 37,
  FSM: 37,
  YEM: 35,
  GNB: 33,
  COM: 33,
  NGA: 31,
  PHL: 30,
  GHA: 30,
  AFG: 28,
  MDV: 28,
  DJI: 28,
  COG: 27,
  SDN: 27,
  MDG: 26,
  KEN: 24,
  VNM: 23,
  SEN: 22,
  BEN: 22,
  KHM: 21,
  ZMB: 21,
  LAO: 20,
  CIB: 20,
  PAK: 18,
  IND: 18,
  CMR: 14,
  GAB: 14,
  MLI: 14,
  PNG: 13,
  GNQ: 13,
  BFA: 12,
  MOZ: 12,
  HTI: 12,
  ERI: 11,
  PRK: 11,
  MWI: 8,
  UGA: 8,
  TZA: 7,
  NER: 7,
  GMB: 7,
  MMR: 7,
  SLE: 6,
  TCD: 6,
  BDI: 6,
  GIN: 5,
  RWA: 5,
  NPL: 5,
  MRT: 5,
  COD: 5,
  CAF: 4,
  LSA: 4,
  ETH: 3,
  LBR: 3,
  BGD: 3,
  SLB: 3,
  SOM: 3,
  TGO: 2
}
const wineStockByDepartment = {
  '01': 10155,
  '02': 686,
  '03': 851,
  '04': 1786,
  '05': 225,
  '06': 66,
  '07': 21156,
  '08': 165,
  '09': 0,
  '10': 7731,
  '11': 207334,
  '12': 0,
  '13': 1699268,
  '14': 325321,
  '15': 4002,
  '16': 11038,
  '17': 493,
  '18': 2712,
  '19': 29,
  '2A': 0,
  '2B': 22518,
  '21': 147630,
  '22': 170,
  '23': 0,
  '24': 40713,
  '25': 0,
  '26': 1115,
  '27': 410,
  '28': 0,
  '29': 0,
  '30': 168319,
  '31': 14023,
  '32': 23450,
  '33': 2416742,
  '34': 856268,
  '35': 9899,
  '36': 267,
  '37': 7179,
  '38': 68,
  '39': 17025,
  '40': 986,
  '41': 53451,
  '42': 8154,
  '43': 1576,
  '44': 120456,
  '45': 4569,
  '46': 15274,
  '47': 1061,
  '48': 62,
  '49': 48127,
  '50': 0,
  '51': 146309,
  '52': 506,
  '53': 906,
  '54': 0,
  '55': 0,
  '56': 0,
  '57': 642,
  '58': 960,
  '59': 3355,
  '60': 424,
  '61': 44,
  '62': 101972,
  '63': 1001,
  '64': 8380,
  '65': 0,
  '66': 80076,
  '67': 219631,
  '68': 6173,
  '69': 232683,
  '70': 0,
  '71': 431251,
  '72': 23,
  '73': 1,
  '74': 29,
  '75': 1486,
  '76': 26255,
  '77': 118021,
  '78': 74781,
  '79': 103690,
  '80': 413,
  '81': 7780,
  '82': 31273,
  '83': 160518,
  '84': 218890,
  '85': 0,
  '86': 3688,
  '87': 803,
  '88': 0,
  '89': 26907,
  '90': 0,
  '91': 8749,
  '92': 11208,
  '93': 4595,
  '94': 13394,
  '95': 840
}
function featureColorScale() {
  const scale = scaleThreshold()
    .domain([100, 300, 700])
    .range(['#ffffcc', '#c2e699', '#78c679', '#238443'])
  return scale
}
export default {
  title: 'Murmur/maps/ChoroplethMap',
  component: ChoroplethMap,
  tags: ['autodocs'],
  argTypes: {}
}

type Story = StoryObj<typeof ChoroplethMap>
const Template: Story = (args: any) => ({
  components: { ChoroplethMap },
  setup() {
    return { args }
  },
  template: `<ChoroplethMap v-bind="args" />`
})

export const Default = Template.bind({})
Default.args = {
  data: motorVehiclesPer1000people
}
export const hatchEmpty = Template.bind({})
hatchEmpty.args = {
  data: motorVehiclesPer1000people,
  hatchEmpty: true
}
export const Zoomable = Template.bind({})
Zoomable.args = {
  data: motorVehiclesPer1000people,
  hatchEmpty: true,
  zoomable: true
}
export const FeatureColorScale = Template.bind({})
FeatureColorScale.args = {
  data: motorVehiclesPer1000people,
  featureColorScale: featureColorScale()
}

export const Topojson = Template.bind({})
Topojson.args = {
  data: wineStockByDepartment,
  clickable: true,
  zoomable: true,
  topojsonUrl: './assets/topojson/france-departments.json',
  topojsonObjects: 'departements',
  topojsonObjectsPath: 'properties.code'
}
const TemplateLegend: Story = (args: any) => ({
  components: { ChoroplethMap },
  setup() {
    return { args }
  },
  template: `
    <choropleth-map v-bind="args">
      <template #legend-cursor="{ value, identifier }">
        <div class="bg-dark text-light px-2 py-1 text-nowrap">
          <span>{{value.toLocaleString()}} hl</span>
        </div>
      </template>
 
    </choropleth-map>`
})
export const TopojsonLegend = TemplateLegend.bind({})
TopojsonLegend.args = {
  data: wineStockByDepartment,
  clickable: true,
  zoomable: true,
  topojsonUrl: './assets/topojson/france-departments.json',
  topojsonObjects: 'departements',
  topojsonObjectsPath: 'properties.code'
}
const TemplateAnnotation: Story = (args: any) => ({
  components: { ChoroplethMap, ChoroplethMapAnnotation },
  setup() {
    const annotation = {
      latitude: 44.836151,
      longitude: -0.580816,
      placement: 'righttop',
      class: 'text-center'
    }
    return { args, annotation }
  },
  template: `
    <choropleth-map v-bind="args">
      <template #legend-cursor="{ value, identifier }">
        <div class="bg-dark text-light px-2 py-1 text-nowrap">
          <span>{{value.toLocaleString()}} hl</span>
        </div>
      </template>
      <choropleth-map-annotation v-bind="annotation">
        Bordeaux<br /><img src="/assets/img/arrow-bottom.svg" width="16px" />
      </choropleth-map-annotation>
    </choropleth-map>`
})
export const TopojsonAnnotation = TemplateAnnotation.bind({})
TopojsonAnnotation.args = {
  data: wineStockByDepartment,
  clickable: true,
  zoomable: true,
  topojsonUrl: './assets/topojson/france-departments.json',
  topojsonObjects: 'departements',
  topojsonObjectsPath: 'properties.code'
}
const TemplateCustomProjection: Story = (args: any) => ({
  components: { ChoroplethMap, ChoroplethMapAnnotation },
  setup() {
    const annotation = {
      class: 'text-center',
      height: 15,
      latitude: 35.167406,
      longitude: 33.435499,
      width: 15,
      dropShadow: 'none',
      scale: true
    }
    return { args, annotation }
  },
  template: `
    <choropleth-map v-bind="args">
      <choropleth-map-annotation v-bind="annotation">
        <div class="border border-warning" style="height: 15px; width: 15px"></div>
      </choropleth-map-annotation>
    </choropleth-map>`
})

export const CustomProjection = TemplateCustomProjection.bind({})
CustomProjection.args = {
  center: [33.435499, 35.167406],
  projection: geoOrthographic,
  zoomMin: 0.9,
  color: '#aaf',
  outlineColor: '#fff',
  graticuleColor: '#333',
  graticule: true,
  hideLegend: true,
  outline: true,
  spherical: true,
  zoomable: true
}

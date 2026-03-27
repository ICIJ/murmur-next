import * as d3 from 'd3'
import { mount } from '@vue/test-utils'
import LineChart from '@/datavisualisations/LineChart/LineChart.vue'

vi.mock('d3', async () => {
  return {
    ...(await vi.importActual('d3'))
  }
})

// Mock HTML element offset so the size of the chart can be calculated
// dynamically using JSDOM and tests
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 0
    }
  },
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || 0
    }
  }
})

describe('LineChart.vue', () => {
  describe('a single chart', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        fixedHeight: 300,
        xAxisTicks: d3.timeYear.every(1),
        data: [
          { date: 2000, value: 0 },
          { date: 2001, value: 1 },
          { date: 2002, value: 2 },
          { date: 2003, value: 3 },
          { date: 2004, value: 4 }
        ]
      }

      wrapper = mount(LineChart, { propsData })
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('is a fixed height chart, regardless of the mode', async () => {
      expect(wrapper.vm.height).toBe(300)
      await wrapper.setProps({ socialMode: true })
      expect(wrapper.vm.height).toBe(300)
    })

    it('creates five x-axis ticks', async () => {
      expect(wrapper.findAll('.line-chart__axis--x .tick')).toHaveLength(5)
    })

    it('creates x-axis ticks with the right years', async () => {
      const ticks = wrapper.findAll('.line-chart__axis--x .tick')
      expect(ticks.at(0).text()).toBe('2000')
      expect(ticks.at(1).text()).toBe('2001')
      expect(ticks.at(2).text()).toBe('2002')
      expect(ticks.at(3).text()).toBe('2003')
      expect(ticks.at(4).text()).toBe('2004')
    })
  })

  describe('a two steps line chart using remote JSON', () => {
    let wrapper

    beforeEach(async () => {
      // eslint-disable-next-line no-import-assign
      d3.json = vi.fn().mockReturnValue([
        { date: 2019, value: 50 },
        { date: 2020, value: 100 }
      ])

      const propsData = {
        data: 'http://localhost/data.json',
        xAxisTicks: d3.timeYear.every(1)
      }
      wrapper = mount(LineChart, { propsData })
      wrapper.vm.$el.style.width = '500px'
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('creates two x-axis ticks', async () => {
      expect(wrapper.findAll('.line-chart__axis--x .tick')).toHaveLength(2)
    })

    it('creates x-axis ticks with the right years', async () => {
      const ticks = wrapper.findAll('.line-chart__axis--x .tick')
      expect(ticks.at(0).text()).toBe('2019')
      expect(ticks.at(1).text()).toBe('2020')
    })
  })

  describe('a multi-line chart with three series', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        fixedHeight: 300,
        xAxisTicks: d3.timeYear.every(1),
        keys: ['injuries', 'deaths'],
        groups: ['Injuries', 'Deaths'],
        lineColors: ['#e53935', '#ff8a80'],
        data: [
          { date: 2000, injuries: 10, deaths: 2 },
          { date: 2001, injuries: 20, deaths: 5 },
          { date: 2002, injuries: 30, deaths: 8 },
          { date: 2003, injuries: 40, deaths: 12 }
        ]
      }

      wrapper = mount(LineChart, { propsData })
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('renders two line paths with valid d attributes', () => {
      const paths = wrapper.findAll('.line-chart__line')
      expect(paths).toHaveLength(2)
      paths.forEach((path) => {
        const d = path.attributes('d')
        expect(d).toBeTruthy()
        expect(d).toContain('M')
        expect(d).not.toContain('NaN')
      })
    })

    it('does not render a single-line path element', () => {
      // In multi-line mode, only the v-for paths should be rendered
      const paths = wrapper.findAll('.line-chart__line')
      expect(paths).toHaveLength(2) // Not 3 (2 multi + 1 single)
    })

    it('renders a legend with two items', () => {
      const items = wrapper.findAll('.line-chart__legend__item')
      expect(items).toHaveLength(2)
    })

    it('renders legend with group names', () => {
      const items = wrapper.findAll('.line-chart__legend__item__label')
      expect(items.at(0).text()).toBe('Injuries')
      expect(items.at(1).text()).toBe('Deaths')
    })

    it('renders legend boxes with correct colors', () => {
      const boxes = wrapper.findAll('.line-chart__legend__item__box')
      expect(boxes.at(0).element.style['background-color']).toBe('rgb(229, 57, 53)')
      expect(boxes.at(1).element.style['background-color']).toBe('rgb(255, 138, 128)')
    })

    it('applies stroke color to each line', () => {
      const paths = wrapper.findAll('.line-chart__line')
      expect(paths.at(0).element.style.stroke).toBe('#e53935')
      expect(paths.at(1).element.style.stroke).toBe('#ff8a80')
    })

    it('hides legend when hideLegend is true', async () => {
      await wrapper.setProps({ hideLegend: true })
      expect(wrapper.find('.line-chart__legend').exists()).toBe(false)
    })

    it('highlights a legend item on mouseover', async () => {
      const items = wrapper.findAll('.line-chart__legend__item')
      await items.at(0).trigger('mouseover')
      expect(items.at(0).classes()).toContain('line-chart__legend__item--highlighted')
      expect(items.at(1).classes()).not.toContain('line-chart__legend__item--highlighted')
    })

    it('adds has-highlight class to root on legend mouseover', async () => {
      const items = wrapper.findAll('.line-chart__legend__item')
      await items.at(0).trigger('mouseover')
      expect(wrapper.classes()).toContain('line-chart--has-highlight')
    })

    it('highlights the matching line path on legend mouseover', async () => {
      const items = wrapper.findAll('.line-chart__legend__item')
      await items.at(0).trigger('mouseover')
      const paths = wrapper.findAll('.line-chart__line')
      expect(paths.at(0).classes()).toContain('line-chart__line--highlighted')
      expect(paths.at(1).classes()).not.toContain('line-chart__line--highlighted')
    })

    it('removes highlight on mouseleave', async () => {
      const items = wrapper.findAll('.line-chart__legend__item')
      await items.at(0).trigger('mouseover')
      expect(wrapper.classes()).toContain('line-chart--has-highlight')
      await items.at(0).trigger('mouseleave')
      expect(wrapper.classes()).not.toContain('line-chart--has-highlight')
    })

    it('uses key names as legend labels when groups are not provided', async () => {
      await wrapper.setProps({ groups: [] })
      const items = wrapper.findAll('.line-chart__legend__item__label')
      expect(items.at(0).text()).toBe('injuries')
      expect(items.at(1).text()).toBe('deaths')
    })
  })

  describe('a 10 columns chart with two highlights using remote CSV', () => {
    let wrapper

    beforeEach(async () => {
      // eslint-disable-next-line no-import-assign
      d3.csv = vi.fn().mockReturnValue([
        { date: 2000, indicator: 0, highlight: false },
        { date: 2001, indicator: 10, highlight: false },
        { date: 2002, indicator: 20, highlight: false },
        { date: 2003, indicator: 30, highlight: false },
        { date: 2004, indicator: 40, highlight: false },
        { date: 2005, indicator: 50, highlight: true },
        { date: 2006, indicator: 60, highlight: false },
        { date: 2007, indicator: 70, highlight: true },
        { date: 2008, indicator: 80, highlight: false },
        { date: 2009, indicator: 90, highlight: false }
      ])

      const propsData = {
        data: 'http://localhost/data.csv',
        dataUrlType: 'csv',
        xAxisTicks: d3.timeYear.every(1),
        seriesName: 'indicator'
      }
      wrapper = mount(LineChart, { propsData })
    })

    afterEach(async () => {
      wrapper.unmount()
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('creates ten x-axis ticks', () => {
      expect(wrapper.findAll('.line-chart__axis--x .tick')).toHaveLength(10)
    })

    it('creates x-axis ticks with the right years', () => {
      const ticks = wrapper.findAll('.line-chart__axis--x .tick')
      expect(ticks.at(0).text()).toBe('2000')
      expect(ticks.at(1).text()).toBe('2001')
      expect(ticks.at(2).text()).toBe('2002')
      expect(ticks.at(3).text()).toBe('2003')
      expect(ticks.at(4).text()).toBe('2004')
      expect(ticks.at(5).text()).toBe('2005')
      expect(ticks.at(6).text()).toBe('2006')
      expect(ticks.at(7).text()).toBe('2007')
      expect(ticks.at(8).text()).toBe('2008')
      expect(ticks.at(9).text()).toBe('2009')
    })
  })
})

import * as d3 from 'd3'
import { mount } from '@vue/test-utils'
import LineChart from '@/datavisualisations/LineChart.vue'

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

  describe('a 10 columns chart with two highlights using remote CSV', () => {
    let wrapper

    beforeEach(async () => {
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

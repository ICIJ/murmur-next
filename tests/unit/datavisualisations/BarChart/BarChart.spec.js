import { mount } from '@vue/test-utils'
import BarChart from '@/datavisualisations/BarChart/BarChart.vue'

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

describe('BarChart.vue', () => {
  describe('a five columns chart with 1 highlight and no y axis', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        data: [
          {
            label: 'Warned about local complications',
            value: 52
          },
          {
            label: 'Not warned',
            value: 42,
            highlight: true
          },
          {
            label: 'Warned thoroughly',
            value: 1
          },
          {
            label: 'Other',
            value: 6
          }
        ]
      }

      wrapper = mount(BarChart, { propsData })

      wrapper.vm.$el.style.width = '500px'
      await wrapper.vm.$nextTick()
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })
  })

  describe('with the sortBy prop set', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        sortBy: 'value',
        data: [
          { label: 'B', value: 20 },
          { label: 'A', value: 50 },
          { label: 'C', value: 10 }
        ]
      }
      wrapper = mount(BarChart, { propsData })
      wrapper.vm.$el.style.width = '500px'
      await wrapper.vm.$nextTick()
    })

    // Regression: sortedData used to sort itself instead of loadedData, so
    // enabling sortBy collapsed the dataset to [] and rendered no bars.
    it('still renders a bar for every datum', () => {
      expect(wrapper.findAll('.bar-chart__bars__item')).toHaveLength(3)
    })

    it('orders the bars by the sortBy field', () => {
      const labels = wrapper
        .findAll('.bar-chart__labels__item')
        .map(node => node.text())
      expect(labels).toEqual(['C', 'B', 'A'])
    })
  })
})

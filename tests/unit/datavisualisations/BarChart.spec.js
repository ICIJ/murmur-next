import * as d3 from 'd3'
import { mount } from '@vue/test-utils'
import BarChart from '@/datavisualisations/BarChart.vue'

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
})

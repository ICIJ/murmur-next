import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { shallowMount } from '@vue/test-utils'
import SymbolMap from '@/maps/SymbolMap.vue'

vi.mock('d3', async () => {
  return {
    ...(await vi.importActual('d3')),
    json: async (url) => {
      const pathname = url.split('https://icij.github.io/murmur/').pop()
      const abspath = resolve(__dirname, join('../../../public', pathname))
      const raw = await fs.readFile(abspath, 'UTF-8')
      return JSON.parse(raw)
    }
  }
})

describe('SymbolMap.vue', () => {
  describe('a map of the world', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        hideTooltip: true,
        data: [
          {
            id: 1,
            latitude: 48.859116,
            longitude: 2.331839,
            color: '#6e40aa',
            category: 'TECH',
            label: 'Paris, France'
          },
          {
            id: 2,
            latitude: -34.035875,
            longitude: 151.194191,
            color: '#ff5e63',
            category: 'FINANCE',
            label: 'Sydney, Australia'
          },
          {
            id: 3,
            latitude: 38.9072,
            longitude: -77.0369,
            color: '#aff05b',
            category: 'EDITO',
            label: 'Washington DC, USA'
          }
        ]
      }
      wrapper = shallowMount(SymbolMap, { propsData })
      wrapper.vm.$refs.el.style.width = '500px'
      await wrapper.vm.loadTopojson()
      await wrapper.vm.$nextTick()
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('has a marker in the tech category', () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-tech path'
      )
      const { nodeValue: fill } =
        feature.wrapperElement.getAttributeNode('fill')
      expect(fill).toBe('#6e40aa')
    })

    it('activates the cursor when mouse is over a marker', async () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-tech path'
      )
      await feature.trigger('mouseover')
      expect(wrapper.vm.markerCursor).toBe(1)
    })

    it('has a marker in the finance category', () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-finance path'
      )
      const { nodeValue: fill } = feature.element.getAttributeNode('fill')
      expect(fill).toBe('#ff5e63')
    })

    it('activates the cursor when mouse is over the finance marker', async () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-finance path'
      )
      await feature.trigger('mouseover')
      expect(wrapper.vm.markerCursor).toBe(2)
    })

    it('deactivates the cursor when mouse leaves the edito marker', async () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-edito path'
      )
      await feature.trigger('mouseover')
      expect(wrapper.vm.markerCursor).toBe(3)

      await feature.trigger('mouseleave')
      expect(wrapper.vm.markerCursor).toBe(null)
    })

    it('set a class to the component when a cursor is active', async () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-tech path'
      )
      await feature.trigger('mouseover')
      expect(wrapper.classes('symbol-map--has-cursor')).toBeTruthy()
    })

    it('remove the class to the component when a cursor is removed', async () => {
      const feature = wrapper.find(
        '.symbol-map__main__markers__item--category-finance path'
      )
      await feature.trigger('mouseover')
      expect(wrapper.vm.markerCursor).toBe(2)

      expect(wrapper.classes('symbol-map--has-cursor')).toBeTruthy()
      await feature.trigger('mouseleave')
      expect(wrapper.classes('symbol-map--has-cursor')).toBeFalsy()
    })
  })
})

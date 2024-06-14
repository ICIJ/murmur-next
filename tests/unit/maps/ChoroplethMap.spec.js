import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { zipObjectDeep } from 'lodash'
import { shallowMount } from '@vue/test-utils'
import ChoroplethMap from '@/maps/ChoroplethMap.vue'

vi.mock('d3', async () => {
  return {
    ...(await vi.importActual('d3')),
    json: async (url) => {
      const pathname = url.split('https://icij.github.io/murmur/').pop()
      const abspath = resolve(__dirname, join('../../../public', pathname))
      const raw = await fs.readFile(abspath, 'UTF-8')
      return JSON.parse(raw)
    },
    zoom() {
      const zoom = {
        scaleExtent: () => zoom,
        translateExtent: () => zoom,
        transform: () => null,
        on: () => zoom
      }
      return zoom
    }
  }
})

describe('ChoroplethMap.vue', () => {
  describe('a map of the world', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        data: {
          FRA: 100,
          SRB: 150,
          KGZ: 200
        }
      }
      wrapper = shallowMount(ChoroplethMap, {
        propsData,
        global: { renderDefaultStub: true }
      })
      wrapper.vm.$refs.resizable.style.width = '500px'
      await wrapper.vm.loadTopojson()
      await wrapper.vm.$nextTick()
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('has a feature for KGZ with the end color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-kgz')
      const color = window.getComputedStyle(feature.wrapperElement).color
      expect(color).toBe('rgb(133, 35, 8)')
    })

    it('has a feature for SRV with the middle color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-srb')
      const color = window.getComputedStyle(feature.element).color
      expect(color).toBe('rgb(194, 145, 132)')
    })

    it('has a feature for FRA with the start color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-fra')
      const color = window.getComputedStyle(feature.element).color
      expect(color).toBe('rgb(255, 255, 255)')
    })

    it('activates the cursor when mouse is over a feature', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-kgz')
      feature.element.dispatchEvent(new Event('mouseover'))
      expect(wrapper.vm.featureCursor).toBe('KGZ')
    })

    it('changes the cursor when mouse is over another feature', () => {
      wrapper.vm.updateFeatureCursor('KGZ')
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-fra')
      feature.element.dispatchEvent(new Event('mouseover'))
      expect(wrapper.vm.featureCursor).toBe('FRA')
    })

    it('deactivates the cursor when mouse leaves a feature', () => {
      wrapper.vm.updateFeatureCursor('KGZ')
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-kgz')
      feature.element.dispatchEvent(new Event('mouseleave'))
      expect(wrapper.vm.featureCursor).toBeNull()
    })

    it('doesnt actve the cursor when mouse is over a feature without data', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-usa')
      feature.element.dispatchEvent(new Event('mouseover'))
      expect(wrapper.vm.featureCursor).toBeNull()
    })

    it('set a class to the component when a cursor is active', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-kgz')
      feature.element.dispatchEvent(new Event('mouseover'))
      await wrapper.vm.$nextTick()
      expect(wrapper.classes('choropleth-map--has-cursor')).toBeTruthy()
    })

    it('remove the class to the component when a cursor is removed', async () => {
      wrapper.vm.updateFeatureCursor('KGZ')
      await wrapper.vm.$nextTick()
      expect(wrapper.classes('choropleth-map--has-cursor')).toBeTruthy()
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-kgz')
      feature.element.dispatchEvent(new Event('mouseleave'))
      await wrapper.vm.$nextTick()
      expect(wrapper.classes('choropleth-map--has-cursor')).toBeFalsy()
    })
  })

  describe('a clickable map of france with data on 3 departments', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        topojsonUrl: '/assets/topojson/france-departments.json',
        topojsonObjects: 'departements',
        topojsonObjectsPath: 'properties.code',
        clickable: true,
        transitionDuration: 0,
        data: {
          '01': 100,
          '02': 150,
          '03': 200
        }
      }
      wrapper = shallowMount(ChoroplethMap, { propsData })
      wrapper.vm.$refs.resizable.style.width = '500px'
      await wrapper.vm.loadTopojson()
      await wrapper.vm.$nextTick()
      // Since JSDOM badly lack SVG support, we need to mock
      // some low level attributes such as size of the SVG element.
      wrapper.vm.setMapNodeSize({
        width: zipObjectDeep(['baseVal.width.value'], [500]),
        height: zipObjectDeep(['baseVal.height.value'], [300])
      })
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('has a feature for 01 with the start color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-01')
      const color = window.getComputedStyle(feature.element).color
      expect(color).toBe('rgb(255, 255, 255)')
    })

    it('has a feature for 02 with the middle color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-02')
      const color = window.getComputedStyle(feature.element).color
      expect(color).toBe('rgb(194, 145, 132)')
    })

    it('has a feature for 03 with the end color of the scale', () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      const color = window.getComputedStyle(feature.element).color
      expect(color).toBe('rgb(133, 35, 8)')
    })

    it('zooms on the map when a feature is clicked', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      await feature.trigger('click')

      const zoomed = wrapper.emitted('zoomed')

      expect(zoomed).toHaveLength(1)
      expect(zoomed[0][0]).toMatchObject({
        properties: {
          code: '03',
          nom: 'Allier'
        }
      })
    })

    it('adds a class to a feature upon click', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      await feature.trigger('click')
      const updatedFeature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      expect(updatedFeature.classes('choropleth-map__main__features__item--zoomed')).toBeTruthy()
      expect(wrapper.emitted('zoomed')).toHaveLength(1)
    })

    it('removes a class from a feature on the second click', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      await feature.trigger('click')
      await feature.trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(2)
      expect(wrapper.emitted('zoomed')).toHaveLength(1)
      expect(feature.classes('choropleth-map__main__features__item--zoomed')).toBeFalsy()
    })

    it('adds a class to the map upon click on a feature', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      await feature.trigger('click')
      expect(wrapper.classes('choropleth-map--has-zoom')).toBeTruthy()
    })

    it('removes a class from the map on the second click', async () => {
      const feature = wrapper.find('.choropleth-map__main__features__item--identifier-03')
      await feature.trigger('click')
      await feature.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.classes('choropleth-map--has-zoom')).toBeFalsy()
    })
  })
})

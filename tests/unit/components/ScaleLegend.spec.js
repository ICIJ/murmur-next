import { shallowMount } from '@vue/test-utils'
import { scaleThreshold } from 'd3-scale'
import ScaleLegend from '@/components/ScaleLegend.vue'
import { vi } from 'vitest'

describe('ScaleLegend.vue', () => {
  let wrapper
  // Common mocks on computed properties
  const colorScaleContext = vi.fn(() => ({ fillRect: vi.fn() }))
  const colorScaleBase64 = vi.fn()
  const computed = { colorScaleBase64, colorScaleContext }

  describe('with a the default scale function', () => {
    beforeEach(() => {
      const propsData = { min: 0, max: 150 }
      wrapper = shallowMount(ScaleLegend, { propsData, computed })
    })

    it('should be a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('should return 0% for no `cursorValue`', () => {
      expect(wrapper.vm.cursorLeft).toBe('0%')
    })

    it('should return 0% for 0 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 0 })
      expect(wrapper.vm.cursorLeft).toBe('0%')
    })

    it('should return 100% for 150 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 150 })
      expect(wrapper.vm.cursorLeft).toBe('100%')
    })

    it('should return have cursor for 150 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 150 })
      expect(wrapper.vm.hasCursor).toBeTruthy()
    })

    it('should return set a class for 150 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 150 })
      expect(wrapper.classes('scale-legend--has-cursor')).toBeTruthy()
    })

    it('should not have cursor for null as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: null })
      expect(wrapper.vm.hasCursor).toBeFalsy()
    })

    it('should return not set a class for null as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: null })
      expect(wrapper.classes('scale-legend--has-cursor')).toBeFalsy()
    })

    it('should give around 100 for the width 100', () => {
      const value = Math.round(wrapper.vm.widthScale(100))
      expect(value).toBe(100)
    })

    it('should give around 150 for the width 150', () => {
      const value = Math.round(wrapper.vm.widthScale(150))
      expect(value).toBe(150)
    })
  })

  describe('with a threshold scale', () => {
    beforeEach(() => {
      // Create a scale with:
      // * values from 0 to 10,000 in white
      // * values from 10,000 to 20,000 in pink
      // * values from 20,000 to 30,000 in red
      const colorScale = scaleThreshold().domain([1e4, 2e4]).range(['white', 'pink', 'red'])
      // Create a scale for value between 0 and 30,000
      const propsData = { min: 0, max: 3e4, width: 150, colorScale }
      wrapper = shallowMount(ScaleLegend, { propsData, computed })
    })

    it('should be a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('should get the correct colors', () => {
      expect(wrapper.vm.colorScaleFunction(0)).toBe('white')
      expect(wrapper.vm.colorScaleFunction(1e3)).toBe('white')
      expect(wrapper.vm.colorScaleFunction(1e4)).toBe('pink')
      expect(wrapper.vm.colorScaleFunction(1e5)).toBe('red')
    })

    it('should get white for the x value 0', () => {
      expect(wrapper.vm.widthScaleColor(0)).toBe('white')
    })

    it('should get white for the x value 25', () => {
      expect(wrapper.vm.widthScaleColor(25)).toBe('white')
    })

    it('should get pink for the x value 99', () => {
      expect(wrapper.vm.widthScaleColor(99)).toBe('pink')
    })

    it('should get pink for the x value 75', () => {
      expect(wrapper.vm.widthScaleColor(75)).toBe('pink')
    })

    it('should get red for the x value 125', () => {
      expect(wrapper.vm.widthScaleColor(125)).toBe('red')
    })

    it('should get red for the x value 150', () => {
      expect(wrapper.vm.widthScaleColor(150)).toBe('red')
    })

    it('should return 33% for 10,000 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 1e4 })
      expect(wrapper.vm.cursorLeft).toBe('33%')
    })

    it('should return 50% for 15,000 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 15e3 })
      expect(wrapper.vm.cursorLeft).toBe('50%')
    })

    it('should return 67% for 20,000 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 2e4 })
      expect(wrapper.vm.cursorLeft).toBe('67%')
    })

    it('should return 100% for 30,000 as `cursorValue`', async () => {
      await wrapper.setProps({ cursorValue: 3e4 })
      expect(wrapper.vm.cursorLeft).toBe('100%')
    })
  })
})

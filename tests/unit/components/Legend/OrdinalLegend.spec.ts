import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import OrdinalLegend from '@/components/Legend/OrdinalLegend.vue'

describe('OrdinalLegend.vue', () => {
  let wrapper: any

  describe('an horizontal legend', () => {
    beforeEach(() => {
      const propsData = {
        data: [
          { id: 1, color: '#6e40aa', label: 'Paris, France' },
          { id: 2, color: '#ff5e63', label: 'Sydney, Australia' },
          { id: 3, color: '#aff05b', label: 'Washington DC, USA' }
        ],
        horizontal: true
      }
      wrapper = shallowMount(OrdinalLegend, { propsData })
    })

    it('should be horizontal', () => {
      expect(wrapper.classes('ordinal-legend--horizontal')).toBeTruthy()
    })

    it('should start with Paris', () => {
      expect(wrapper.findAll('.ordinal-legend__item__label').at(0).text()).toBe('Paris, France')
    })

    it('should end with DC', () => {
      expect(wrapper.findAll('.ordinal-legend__item__label').at(2).text()).toBe('Washington DC, USA')
    })

    it('should create 3 legend items', () => {
      expect(wrapper.findAll('.ordinal-legend__item')).toHaveLength(3)
    })

    it('should create a marker with the right color for Paris', () => {
      const path = wrapper.findAll('.ordinal-legend__item__marker__path').at(0)
      const { nodeValue: fill } = path.element.getAttributeNode('fill')
      expect(fill).toBe('#6e40aa')
    })

    it('should create a marker with the right color for Sydney', () => {
      const path = wrapper.findAll('.ordinal-legend__item__marker__path').at(1)
      const { nodeValue: fill } = path.element.getAttributeNode('fill')
      expect(fill).toBe('#ff5e63')
    })
  })

  describe('a vertical legend with an highlight', () => {
    beforeEach(() => {
      const propsData = {
        data: [
          { id: 1, color: '#6e40aa', label: 'Paris, France' },
          { id: 2, color: '#ff5e63', label: 'Sydney, Australia' },
          { id: 3, color: '#aff05b', label: 'Washington DC, USA' }
        ],
        highlight: 2,
        value: 1,
        horizontal: false
      }
      wrapper = shallowMount(OrdinalLegend, { propsData })
    })

    it('should be not horizontal', () => {
      expect(wrapper.classes('ordinal-legend--horizontal')).toBeFalsy()
    })

    it('should create 3 legend items', () => {
      expect(wrapper.findAll('.ordinal-legend__item')).toHaveLength(3)
    })

    it('should not highlight the first item', () => {
      const item = wrapper.findAll('.ordinal-legend__item').at(0)
      expect(item.classes('ordinal-legend__item--highlighted')).toBeFalsy()
    })

    it('should highlight the second item', () => {
      const item = wrapper.findAll('.ordinal-legend__item').at(1)
      expect(item.classes('ordinal-legend__item--highlighted')).toBeTruthy()
    })

    it('should highlight the first item', () => {
      const item = wrapper.findAll('.ordinal-legend__item').at(0)
      expect(item.classes('ordinal-legend__item--selected')).toBeTruthy()
    })

    it('should emit an highlight event when mouse over the first item', async () => {
      const item = wrapper.findAll('.ordinal-legend__item a').at(0)
      await item.trigger('mouseover')
      expect(wrapper.emitted('update:highlight')).toBeTruthy()
      expect(wrapper.emitted('update:highlight')).toHaveLength(1)
      expect(wrapper.emitted('update:highlight')[0]).toEqual([1])
    })

    it('should emit an highlight event when mouse over the last item', async () => {
      const item = wrapper.findAll('.ordinal-legend__item a').at(2)
      await item.trigger('mouseover')
      expect(wrapper.emitted('update:highlight')).toBeTruthy()
      expect(wrapper.emitted('update:highlight')).toHaveLength(1)
      expect(wrapper.emitted('update:highlight')[0]).toEqual([3])
    })

    it('should emit an update event when mouse click the first item', async () => {
      const item = wrapper.findAll('.ordinal-legend__item a').at(0)
      await item.trigger('click')
      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')).toHaveLength(1)
      expect(wrapper.emitted('update')[0]).toEqual([1])
    })

    it('should emit an update event when mouse click the last item', async () => {
      const item = wrapper.findAll('.ordinal-legend__item a').at(2)
      await item.trigger('click')
      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')).toHaveLength(1)
      expect(wrapper.emitted('update')[0]).toEqual([3])
    })
  })
})

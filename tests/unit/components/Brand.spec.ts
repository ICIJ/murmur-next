import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Brand from '@/components/Brand.vue'

describe('Brand.vue', () => {
  it('should be a Vue instance', () => {
    const wrapper = shallowMount(Brand)
    expect(wrapper.vm).toBeTruthy()
  })

  it('should generate a SVG', () => {
    const wrapper = shallowMount(Brand)
    expect(wrapper.find('svg').exists()).toBeTruthy()
  })

  it('should change logo color to red', () => {
    const color = 'red'
    const props = { color }
    const wrapper = shallowMount(Brand, { props })
    expect(wrapper.element.style.color).toBe(color)
  })

  it('should change logo color to blue', () => {
    const color = 'blue'
    const props = { color }
    const wrapper = shallowMount(Brand, { props })
    expect(wrapper.element.style.color).toBe(color)
  })

  it('should change logo color to #A10207', () => {
    const color = 'rgb(161, 2, 7)'
    const props = { color }
    const wrapper = shallowMount(Brand, { props })
    expect(wrapper.element.style.color).toBe(color)
  })

  it('should change logo background to red', () => {
    const background = 'red'
    const props = { background }
    const wrapper = shallowMount(Brand, { props })
    expect(wrapper.element.style.background).toBe(background)
  })

  it('should change logo background to rgb(161, 2, 7)', () => {
    const background = 'rgb(161, 2, 7)'
    const props = { background }
    const wrapper = shallowMount(Brand, { props })
    expect(wrapper.element.style.background).toBe(background)
  })
})

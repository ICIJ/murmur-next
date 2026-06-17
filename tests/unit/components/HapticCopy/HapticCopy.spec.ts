import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest'
import HapticCopy from '@/components/HapticCopy/HapticCopy.vue'

describe('HapticCopy.vue', () => {
  const propsData = { text: 'Lorem ipsum', noTooltip: true }

  beforeAll(() => {
    // Prevent multiple Bootstrap Vue warnings in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterAll(() => {
    console.warn.mockClear()
  })

  it('is a Vue instance', () => {
    const wrapper = mount(HapticCopy, { propsData })
    expect(wrapper.vm).toBeTruthy()
  })

  it('should generate a button', () => {
    const wrapper = mount(HapticCopy, { propsData })
    expect(wrapper.find('button').exists()).toBeTruthy()
  })

  it('shouldn\'t hide the label', () => {
    const wrapper = mount(HapticCopy, { propsData })
    expect(wrapper.find('.haptic-copy__label').classes('visually-hidden')).toBeFalsy()
  })

  it('should hide the label', () => {
    const wrapper = mount(HapticCopy, {
      propsData: {
        ...propsData,
        hideLabel: true
      }
    })
    expect(wrapper.find('.haptic-copy__label').classes('visually-hidden')).toBeTruthy()
  })

  it('should use a custom label', () => {
    const wrapper = mount(HapticCopy, {
      propsData: {
        ...propsData,
        label: 'Copy in the clipboard'
      }
    })
    expect(wrapper.find('.haptic-copy__label').text()).toBe('Copy in the clipboard')
  })

  it('should emit an `success` event after copying text', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.copy()
    expect(wrapper.emitted().success).toBeTruthy()
  })

  it('should emit an `attempt` event before copying text', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.copy()
    expect(wrapper.emitted().attempt).toBeTruthy()
  })

  it('should not fill the tooltip content with an error', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.copy()
    expect(wrapper.vm.tooltipContent).not.toBe('Unable to copy the text')
  })

  it('should fill the tooltip content with a success message', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.copy()
    expect(wrapper.vm.tooltipContent).toBe('Copied!')
  })

  it('should empty tooltip content', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.hide()
    expect(wrapper.vm.tooltipContent).toBe('')
  })

  it('should have a method `copy` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.copy()
    expect(promise.then).toBeDefined()
  })

  it('should have a method `hide` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.hide()
    expect(promise.then).toBeDefined()
  })

  it('should resolve the success locale message after copying', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.copy()
    expect(wrapper.vm.tooltipContent).toBe('Copied!')
  })
})

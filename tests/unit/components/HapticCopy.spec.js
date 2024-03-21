import { mount } from '@vue/test-utils'
import HapticCopy from '@/components/HapticCopy.vue'
import noop from 'lodash/noop'

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

  it("shouldn't hide the label", () => {
    const wrapper = mount(HapticCopy, { propsData })
    expect(wrapper.find('.haptic-copy__label').classes('sr-only')).toBeFalsy()
  })

  it('should hide the label', () => {
    const wrapper = mount(HapticCopy, {
      propsData: {
        ...propsData,
        hideLabel: true
      }
    })
    expect(wrapper.find('.haptic-copy__label').classes('sr-only')).toBeTruthy()
  })

  it('should use a custom label', () => {
    const wrapper = mount(HapticCopy, {
      propsData: {
        ...propsData,
        label: 'Copy in the clipboard'
      }
    })
    expect(wrapper.find('.haptic-copy__label').text()).toBe(
      'Copy in the clipboard'
    )
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

  it('should fill the tooltip content with a success message', () => {
    const wrapper = mount(HapticCopy, { propsData })
    wrapper.vm.openTooltip()
    expect(wrapper.vm.tooltipContent).toBe('Copied!')
  })

  it('should empty tooltip content', async () => {
    const wrapper = mount(HapticCopy, { propsData })
    await wrapper.vm.closeTooltip()
    expect(wrapper.vm.tooltipContent).toBe('')
  })

  it('should have a method `nextTimeout` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.nextTimeout(noop, 0)
    expect(promise.then).toBeDefined()
  })

  it('should have a method `copy` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.copy()
    expect(promise.then).toBeDefined()
  })

  it('should have a method `openTooltip` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.openTooltip()
    expect(promise.then).toBeDefined()
  })

  it('should have a method `closeTooltip` which returns a promise', () => {
    const wrapper = mount(HapticCopy, { propsData })
    const promise = wrapper.vm.closeTooltip()
    expect(promise.then).toBeDefined()
  })

  it('should change the tooltip content with locale message', () => {
    const wrapper = mount(HapticCopy, { propsData })
    wrapper.vm.openTooltip('haptic-copy.tooltip.succeed')
    expect(wrapper.vm.tooltipContent).toBe('Copied!')
    wrapper.vm.openTooltip('haptic-copy.tooltip.failed')
    expect(wrapper.vm.tooltipContent).toBe('Unable to copy the text')
  })

  it('should change the tooltip content with arbitrary message', () => {
    const wrapper = mount(HapticCopy, { propsData })
    wrapper.vm.openTooltip('foo')
    expect(wrapper.vm.tooltipContent).toBe('foo')
    wrapper.vm.openTooltip('bar')
    expect(wrapper.vm.tooltipContent).toBe('bar')
  })
})

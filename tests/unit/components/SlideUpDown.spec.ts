import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SlideUpDown from '@/components/SlideUpDown.vue'

describe('SlideUpDown', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(SlideUpDown)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the component as a `div` by default', () => {
    const wrapper = mount(SlideUpDown)
    expect(wrapper.element.nodeName).toBe('DIV')
  })

  it('renders the component as a `span` when props.tag is passed', () => {
    const tag = 'SPAN'
    const wrapper = mount(SlideUpDown, {
      propsData: { tag }
    })
    expect(wrapper.element.nodeName).toBe(tag)
  })

  it('is visible by default', () => {
    const wrapper = mount(SlideUpDown)
    expect(wrapper.element.style.height).toBe('auto')
  })

  it('isn\'t visible if props.active is passed as `false`', async () => {
    const active = false
    const wrapper = mount(SlideUpDown, {
      propsData: { active }
    })
    wrapper.vm.mounted = true
    await wrapper.vm.$nextTick()
    expect(wrapper.element.style.height).toBe('0px')
  })

  it('calls `cleanLayout` after the transition', async () => {
    const wrapper = mount(SlideUpDown)
    wrapper.vm.cleanLayout = vi.fn()
    expect(wrapper.vm.cleanLayout.mock.calls.length).toBe(0)
    await wrapper.setProps({ active: false })
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(wrapper.vm.cleanLayout.mock.calls.length).toBe(1)
        resolve()
      }, wrapper.vm.duration)
    })
  })

  it('calls `cleanLayout` which change the state from `pre` to `active`', async () => {
    const wrapper = mount(SlideUpDown)
    const deferred = wrapper.vm.triggerSlide()
    expect(wrapper.vm.state).toBe('pre')
    await deferred
    expect(wrapper.vm.state).toBe('active')
  })
})

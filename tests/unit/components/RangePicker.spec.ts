import {shallowMount} from '@vue/test-utils'

import RangePicker from '@/components/RangePicker.vue'

describe('RangePicker.vue', () => {

  it('renders without crashing', () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: {
        range: [0.2, 0.8]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('correctly initializes data with props', () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: {
        range: [0.2, 0.8]
      }
    })
    expect(wrapper.vm.start).toBe(0.2)
    expect(wrapper.vm.end).toBe(0.8)
  })

  it('sets the correct class based on the variant prop', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [0.1, 0.9], variant: 'secondary' }
    })

    expect(wrapper.classes()).toContain('range-picker--secondary')
  })

  it('sets the rounded class if rounded prop is true', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [0.1, 0.9], rounded: true }
    })

    expect(wrapper.classes()).toContain('range-picker--rounded')
  })

  it('sets the hover class if hover prop is true', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [0.1, 0.9], hover: true }
    })

    expect(wrapper.classes()).toContain('range-picker--hover')
  })

  it('sets the disabled class if value prop is empty', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [] }
    })

    expect(wrapper.classes()).toContain('range-picker--disabled')
  })

  it('hides the bounds if value prop is empty', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [] }
    })

    expect(wrapper.find('.range-picker__bounds').isVisible()).toBeFalsy()
  })

  it('does not allow bounds closer than minDistance', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [0.1, 0.11], minDistance: 0.05 }
    })

    wrapper.vm.dragStartBound(0.06)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.start).not.toBe(0.06)
  })

  it('snaps value based on snap prop', async () => {
    const wrapper = shallowMount(RangePicker, {
      propsData: { range: [0.1, 0.9], snap: 0.05 }
    })

    wrapper.vm.dragStartBound(0.12)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.start).toBe(0.10)
  })
})

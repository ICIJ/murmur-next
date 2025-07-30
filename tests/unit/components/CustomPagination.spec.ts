import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustomPagination from '@/components/CustomPagination.vue'

describe('CustomPagination.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(CustomPagination)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the pagination component', () => {
    const wrapper = mount(CustomPagination)
    expect(wrapper.find('.custom-pagination').exists()).toEqual(true)
  })

  it('expects totalRows, perPage, modelValue as props', () => {
    const propsData = { totalRows: 200, perPage: 20, modelValue: 2 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.vm.totalRows).toBe(200)
    expect(wrapper.vm.perPage).toBe(20)
    expect(wrapper.vm.modelValue).toBe(2)
  })

  it('accepts pills as a prop to change pagination styling', () => {
    const propsData = { pills: true }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.vm.pills).toBeTruthy()
  })

  it('calculates numberOfPages based on the totalRows and perPage prop values', () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.find('.custom-pagination__number-of-pages').text()).toBe('10 pages total')
  })

  it('emits an event on form submit with the currentPageInput', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    const input = wrapper.find('.form-control')
    await input.setValue(3)
    await wrapper.find({ ref: 'customPaginationForm' }).trigger('submit')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    // @ts-expect-error We know the emitted value is an array with one element
    expect(wrapper.emitted('update:modelValue')[0]).toContain(3)
  })

  it('does not emit an event if the currentPageInput is invalid', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    await wrapper.find('.form-control').setValue('')
    await wrapper.find({ ref: 'customPaginationForm' }).trigger('submit')
    expect(wrapper.emitted()).toMatchObject({})
  })

  it('sets errors if the currentPageInput is invalid', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.find('.custom-pagination__errors').exists()).toBe(false)

    await wrapper.find('.form-control').setValue('')
    await wrapper.find({ ref: 'customPaginationForm' }).trigger('submit')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.custom-pagination__errors').exists()).toBe(true)
    expect(wrapper.find('.custom-pagination__errors').text()).toBe('Invalid page number')
  })
})

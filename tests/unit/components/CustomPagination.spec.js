import { mount } from '@vue/test-utils'
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
    expect(wrapper.vm.numberOfPages).toBe(10)
  })

  it('emits an event on form submit with the currentPageInput', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    const input = wrapper.find('.form-control')
    input.element.value = 3
    await input.trigger('input')
    wrapper.vm.customPaginationForm.dispatchEvent(new Event('submit'))

    expect(wrapper.emitted('update:modelValue')[0]).toContain(3)
  })

  it('does not emit an event if the currentPageInput is invalid', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.vm.currentPageInput).toBe('')
    await wrapper.vm.applyJumpFormPage()
    expect(wrapper.emitted()).toMatchObject({})
  })

  it('sets errors if the currentPageInput is invalid', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.vm.currentPageInput).toBe('')
    await wrapper.vm.applyJumpFormPage()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors.length).toBe(1)
  })

  it('renders an element containing the errors if the currentPageInput is invalid', async () => {
    const propsData = { totalRows: 200, perPage: 20 }
    const wrapper = mount(CustomPagination, { propsData })
    expect(wrapper.vm.currentPageInput).toBe('')
    await wrapper.vm.applyJumpFormPage()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#invalid-number-error').exists()).toEqual(true)
  })
})

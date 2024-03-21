import { mount } from '@vue/test-utils'
import GenericFooter from '@/components/GenericFooter.vue'

describe('GenericFooter.vue', () => {
  const propsData = { version: '1.0.0' }

  it('is a Vue instance', () => {
    const wrapper = mount(GenericFooter)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the passed props.version', () => {
    const wrapper = mount(GenericFooter, { propsData })
    expect(wrapper.find('.generic-footer__version').text()).toBe(
      'Version 1.0.0'
    )
  })

  it("doesn't render the version", () => {
    const wrapper = mount(GenericFooter)
    expect(wrapper.find('.generic-footer__version').exists()).toBeFalsy()
  })

  it('renders the current year', () => {
    const wrapper = mount(GenericFooter)
    const currentYear = new Date().getFullYear()
    expect(wrapper.find('.generic-footer__year').text()).toBe(
      String(currentYear)
    )
  })
})

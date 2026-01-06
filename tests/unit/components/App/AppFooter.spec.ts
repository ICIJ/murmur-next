import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppFooter from '@/components/App/AppFooter.vue'

describe('AppFooter.vue', () => {
  const propsData = { version: '1.0.0' }

  it('is a Vue instance', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the passed props.version', () => {
    const wrapper = mount(AppFooter, { propsData })
    expect(wrapper.find('.app-footer__version').text()).toBe('Version 1.0.0')
  })

  it('doesn\'t render the version', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.find('.app-footer__version').exists()).toBeFalsy()
  })

  it('renders the current year', () => {
    const wrapper = mount(AppFooter)
    const currentYear = new Date().getFullYear()
    expect(wrapper.find('.app-footer__year').text()).toBe(String(currentYear))
  })
})
